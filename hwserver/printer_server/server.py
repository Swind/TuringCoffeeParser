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

        self._subscriber_looper = SubscribeLooper()
        self._subscriber_looper.sub(self._output_temp_reader)
        self._subscriber_looper.sub(self._heater_temp_reader)
        self._subscriber_looper.sub(self._cold_temp_reader)
        pass

    def __del__(self):
        self._subscriber_looper.stop()

    def _group(self, points):
        water_sum = 0
        start = 0
        for index, point in enumerate(points):
            if point.e is not None:
                water_sum += point.e
                if water_sum > CONST_ML:
                    yield points[start:index+1]
                    start = index
        yield points[start:index+1]

    @staticmethod
    def _calculate_ratio(t, hot_t, cold_t, out_t):

        if hot_t == cold_t:
            return 0

        t = float(t)
        hot_t = float(hot_t)
        cold_t = float(cold_t)
        out_t = float(out_t)

        ratio = (t - cold_t)/(hot_t - cold_t)

        if ratio <= 0:
            return 0
        elif ratio >= 1:
            return 1
        else:
            return ratio

    def _mix(self, points):
        point_pairs = []
        cold_t = self._cold_temp_reader.read()
        hot_t = self._heater_temp_reader.read()
        out_t = self._output_temp_reader.read()

        for point in points:
            point_pair = [copy.deepcopy(point), copy.deepcopy(point)]
            if point.is_point():
                if (point.e is not None) and (point.t is not None):
                    ratio = RealTimeTemperatureMixer._calculate_ratio(
                            point.t, hot_t, cold_t, out_t)
                    point_pair[0].e = point_pair[0].e * ratio
                    point_pair[1].e = point.e - point_pair[0].e
                else:
                    point_pair[1].e = None
            point_pairs.append(point_pair)
        return point_pairs

    def mix(self, points):
        groups = self._group(points)
        for group in groups:
            tmp = self._mix(group)
            yield tmp


class PointStepRunner(object):

    def __init__(self, ctrler):
        self._ctrler = ctrler

    def step(self, point_pairs):
        for pair in point_pairs:
            hot_gcode = pair[0].to_gcode()
            cold_gcode = pair[1].to_gcode()
            self._ctrler.send_gcodes(hot_gcode, cold_gcode)
            yield False


class PrinterServer(object):

    def __init__(self,
                 publisher,
                 responser,
                 output_temp_reader,
                 heater_temp_reader,
                 cold_temp_reader,
                 printer_controller):

        self._puber = publisher
        self._reper = responser
        self._ctrler = printer_controller
        self._mixer = RealTimeTemperatureMixer(
                output_temp_reader=output_temp_reader,
                heater_temp_reader=heater_temp_reader,
                cold_temp_reader=cold_temp_reader)
        self._runner = PointStepRunner(self._ctrler)

        self._stop_flag = False
        self._q = Queue()
        self._thread = Thread(target=self._start)
        self._thread.daemon = True
        self._thread.start()

    def __del__(self):
        self.stop()

    def _split_points_by_wait(self, points):
        point_groups = []
        start = 0
        end = 0
        for (end, point) in enumerate(points):
            if point.is_command() and point.name == 'wait':
                point_groups.append(points[start:end])
                point_groups.append(point)
                start = end + 1
        point_groups.append(points[start:end+1])
        return point_groups

    def _wait(self, sec):
        while self._stop_flag is not True:
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
            try:
                params = self._q.get(False, 1)
                points = [Point(p) for p in params]
                point_groups = self._split_points_by_wait(points)
                for g in point_groups:
                    if type(g) is list:
                        point_pairs = self._mixer.mix(g)
                        for points in point_pairs:
                            stepper = self._runner.step(points)
                            while self._stop_flag is not True:
                                try:
                                    stepper.next()
                                except StopIteration:
                                    break
                    else:
                        if self._wait(g.total_time) is not True:
                            break
            except Empty:
                continue

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

    def stop(self):
        self._stop_flag = True
