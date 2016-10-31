import copy
import logging
import time
from Queue import Queue, Empty
from threading import Thread

from pubsub.pubsub import SubscribeLooper
from point import Point

logger = logging.getLogger(__name__)
CONST_ML = 30


class RealTimeTemperatureMixer(object):

    def __init__(self,
                 output_temp_reader,
                 heater_temp_reader,
                 cold_temp_reader):
        self._output_temp_reader = output_temp_reader
        self._heater_temp_reader = heater_temp_reader
        self._cold_temp_reader = cold_temp_reader
        self._calibration_hot = 90
        self._calibration_cold = 20

        self._subscriber_looper = SubscribeLooper()
        self._subscriber_looper.sub(self._output_temp_reader)
        self._subscriber_looper.sub(self._heater_temp_reader)
        self._subscriber_looper.sub(self._cold_temp_reader)

        self._ratio = 0.0
        self._offset = 0.0

    def __del__(self):
        self._subscriber_looper.stop()

    def capture_calibration_hot(self):
        self._calibration_hot = self._output_temp_reader.read()

    def capture_calibration_cold(self):
        self._calibration_cold = self._output_temp_reader.read()

    @staticmethod
    def _calculate_ratio(t, hot_t, cold_t, out_t):

        if hot_t == cold_t:
            return 0

        t = float(t)
        hot_t = float(hot_t)
        cold_t = float(cold_t)
        out_t = float(out_t)

        ratio = (t - cold_t)/(hot_t - cold_t)

        if ratio > 1.0:
            ratio = 1.0
        elif ratio < 0:
            ratio = 0

        return ratio

    @staticmethod
    def _calculate_offset(t, hot_t, cold_t, out_t, offset):

        if hot_t == cold_t:
            return 0

        t = float(t)
        hot_t = float(hot_t)
        cold_t = float(cold_t)
        out_t = float(out_t)
        diff_t = out_t - t

        ratio = RealTimeTemperatureMixer._calculate_ratio(t, hot_t, cold_t, out_t)
        offset_upper_limit = (1.0 - ratio)
        offset_lower_limit = -(ratio)
        offset_upper_unit = (offset_upper_limit/50)
        offset_lower_unit = (offset_lower_limit/50)

        if offset_upper_unit < 0.01:
            offset_upper_unit = 0.01
        if offset_lower_unit > -0.01:
            offset_lower_unit = -0.01

        if diff_t > 0:
            offset += offset_lower_unit
        else:
            offset += offset_upper_unit

        if offset > offset_upper_limit:
            offset = offset_upper_limit
        elif offset < offset_lower_limit:
            offset = offset_lower_limit

        return offset

    def _mix(self, points):
        point_pairs = []
        out_t = self._output_temp_reader.read()

        offset = None
        for point in points:
            point_pair = [copy.deepcopy(point), copy.deepcopy(point)]
            if point.is_point():
                if (point.e is not None) and (point.t is not None):
                    if offset is None:
                        offset = RealTimeTemperatureMixer._calculate_offset(
                                point.t,
                                self._calibration_hot,
                                self._calibration_cold,
                                out_t,
                                self._offset)
                        self._offset = offset
                    ratio = RealTimeTemperatureMixer._calculate_ratio(
                            point.t,
                            self._calibration_hot,
                            self._calibration_cold,
                            out_t)

                    ratio = ratio + offset
                    if ratio > 1.0:
                        ratio = 1.0
                    elif ratio < 0:
                        ratio = 0

                    self._ratio = ratio
                    point_pair[0].e = point_pair[0].e * ratio
                    point_pair[1].e = point.e - point_pair[0].e
                else:
                    point_pair[1].e = None
            point_pairs.append(point_pair)

        return point_pairs

    def mix(self, points):
        return self._mix(points)


class PointStepRunner(object):

    def __init__(self, ctrler):
        self._ctrler = ctrler

    def step(self, point_pairs):
        for pair in point_pairs:
            hot_gcode = pair[0].to_gcode()
            cold_gcode = pair[1].to_gcode()
            self._ctrler.send_gcodes(hot_gcode, cold_gcode)
            yield


class PrinterServer(object):

    def __init__(self,
                 publisher,
                 responser,
                 output_temp_reader,
                 heater_temp_reader,
                 cold_temp_reader,
                 printer_controller,
                 refill_commander,
                 waste_water_point):

        self._puber = publisher
        self._reper = responser
        self._ctrler = printer_controller
        self._mixer = RealTimeTemperatureMixer(
                output_temp_reader=output_temp_reader,
                heater_temp_reader=heater_temp_reader,
                cold_temp_reader=cold_temp_reader)
        self._runner = PointStepRunner(self._ctrler)
        self._refill_commander = refill_commander
        self._waste_water_point = waste_water_point

        self._num_handled_points = 0
        self._num_total_points = 0

        self._stop_flag = False
        self._q = Queue()
        self._thread = Thread(target=self._start)
        self._thread.daemon = True
        self._thread.start()

        self._pubthread = Thread(target=self._pub)
        self._pubthread.daemon = True
        self._pubthread.start()

    def __del__(self):
        self.stop()

    def _split_points(self, points):
        point_groups = []
        start = 0
        end = 0
        water_sum = 0
        for (end, point) in enumerate(points):
            if point.is_command() and \
               (point.name == 'wait' or point.name == 'calibration'):
                point_groups.append(points[start:end])
                point_groups.append(point)
                start = end + 1
                water_sum = 0
            elif point.e is not None:
                water_sum += point.e
                if water_sum > CONST_ML:
                    point_groups.append(points[start:end+1])
                    start = end + 1
                    water_sum = 0
        point_groups.append(points[start:end+1])
        return point_groups

    def _wait(self, sec):
        while (self._stop_flag is not True) and (sec != 0):
            time.sleep(1)
            sec = sec - 1

        if sec == 0:
            return True
        else:
            return False

    def _start(self):
        if self._ctrler.connect() is not True:
            logger.error("Fail to connect to printer")
            return

        while self._stop_flag is not True:

            params = None

            try:
                params = self._q.get(False, 1)
            except Empty:
                time.sleep(1)
                continue

            self._refill_toggle(False)
            self._num_total_points = 0
            self._num_handled_points = 0

            points = [Point(p) for p in params]
            point_groups = self._split_points(points)

            for g in point_groups:
                if type(g) is list:
                    point_pairs = self._mixer.mix(g)
                    stepper = self._runner.step(point_pairs)
                    while self._stop_flag is not True:
                        try:
                            stepper.next()
                            self._num_handled_points += 1
                        except StopIteration:
                            break
                elif g.name == 'wait':
                    logger.info('Wait {} seconds'.format(g.time))
                    if self._wait(g.time) is not True:
                        break
                    self._num_handled_points += 1
                elif g.name == 'calibration':
                    logger.info('Calibration')
                    if self._calibration() is not True:
                        break
                    self._num_handled_points += 1

            self._num_total_points = 0
            self._num_handled_points = 0
            self._refill_toggle(True)

        self._ctrler.disconnect()
        self._stop_flag = False

    def start(self):
        while True:
            msg = self._reper.recv()

            if 'stop' in msg and msg['stop'] is True:
                self.stop()
                break
            elif 'cancel' in msg:
                pass
            elif 'points' in msg:
                self._q.put(msg['points'])
            elif 'calibration' in msg:
                self._q.put([Point.create_command('calibration')])

    def stop(self):
        self._stop_flag = True

    def _calibration(self):

        waste_water_point = copy.deepcopy(self._waste_water_point)
        waste_water_point.f = 5000

        # HOME
        stepper = self._runner.step([
            [
                Point.create_command('home'),
                Point.create_command('home')
            ],
            [
                Point.create_point(z=waste_water_point.z, f=waste_water_point.f),
                Point.create_point(z=waste_water_point.z, f=waste_water_point.f)
            ],
            [
                waste_water_point,
                waste_water_point
            ]
        ])
        stepper.next()
        stepper.next()
        stepper.next()

        # Output Cold water
        stepper = self._runner.step([
            [
                Point.create_point(f=250),
                Point.create_point(e=0.1, f=250)
            ]
        ] * 1000)
        while self._stop_flag is not True:
            try:
                stepper.next()
            except StopIteration:
                break
        if self._stop_flag is True:
            return

        self._mixer.capture_calibration_cold()

        # Output Hot water
        stepper = self._runner.step([
            [
                Point.create_point(e=0.1, f=200),
                Point.create_point(f=200)
            ]
        ] * 1000)
        while self._stop_flag is not True:
            try:
                stepper.next()
            except StopIteration:
                break
        if self._stop_flag is True:
            return

        self._mixer.capture_calibration_hot()
        return True

    def _refill_toggle(self, toggle=False):
        if toggle is True:
            self._refill_commander.req({'Refill': 'START'})
        else:
            self._refill_commander.req({'Refill': 'STOP'})

    def _pub(self):
        while True:
            self._puber.pub({
                "total_points": self._num_total_points,
                "handled_points": self._num_handled_points,
                "ratio": self._mixer._ratio
            })
            time.sleep(1)
