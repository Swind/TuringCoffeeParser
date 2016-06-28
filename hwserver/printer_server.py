#!/usr/bin/env python
# -*- coding: utf-8 -*-

import copy
import logging
import Queue

from threading import Lock, Thread

from utils import json_config
from utils import channel

logger = logging.getLogger(__name__)
CONST_ML = 30
CONST_COLD_TEMPERATURE = 20


def _point_to_gcode(point):
    if point is None:
        return None

    gcode = 'G1'
    if ('x' in point) and (point['x'] is not None):
        gcode += ' X{}'.format(point['x'])
    if ('y' in point) and (point['y'] is not None):
        gcode += ' Y{}'.format(point['y'])
    if ('z' in point) and (point['z'] is not None):
        gcode += ' Z{}'.format(point['z'])
    if ('e' in point) and (point['e'] is not None):
        gcode += ' E{}'.format(point['e'])
    if ('f' in point) and (point['f'] is not None):
        gcode += ' F{}'.format(point['f'])

    return gcode


def _calculate_ratio(t, hot_t, cold_t, out_t):

    if hot_t == cold_t:
        return 0

    t = float(t)
    hot_t = float(hot_t)
    cold_t = float(cold_t)
    out_t = float(out_t)

    ratio = (t - cold_t)/(hot_t - cold_t) + (t - out_t)/(hot_t - out_t)

    if ratio <= 0:
        return 0
    elif ratio >= 1:
        return 1
    else:
        return ratio


class _AtomicValue(object):

    def __init__(self, initial_value):
        self.__lock = Lock()
        self.__value = initial_value

    @property
    def value(self):
        self.__lock.acquire()
        v = self.__value
        self.__lock.release()
        return v

    @value.setter
    def value(self, v):
        self.__lock.acquire()
        self.__value = v
        self.__lock.release()


class PrinterConfig(object):

    def __init__(self, port, baudrate):
        self.port = port
        self.baudrate = baudrate


class PrinterController(object):

    def __init__(self, cold_config, hot_config):
        from utils.smoothie import Smoothie
        self._hot_printer = Smoothie(hot_config.port, hot_config.baudrate)
        self._cold_printer = Smoothie(cold_config.port, cold_config.baudrate)

        self._printer_lock = Lock()
        self.command_counter = _AtomicValue(0)

    def connect(self):
        if self._hot_printer.open() is not True:
            logger.error('Cannot open printer for hot water')
            return False
        if self._cold_printer.open() is not True:
            logger.error('Cannot open printer for cold water')
            return False

        # Home
        self.send_gcodes('G28', 'G28')
        # Set Units to Millimeters
        self.send_gcodes('G21', 'G21')
        # Set to Absolute Positioning
        self.send_gcodes('G90', 'G90')
        # Set extruder to relative mode
        self.send_gcodes('M83', 'M83')

        return True

    def disconnect(self):
        self._hot_printer.close()
        self._cold_printer.close()

    def send_gcodes(self, hot_command=None, cold_command=None):

        self._printer_lock.acquire()

        if hot_command is not None:
            self._hot_printer.write(hot_command)
        if cold_command is not None:
            self._cold_printer.write(cold_command)

        if hot_command is not None:
            while 'ok' not in self._hot_printer.readline():
                continue
        if cold_command is not None:
            while 'ok' not in self._cold_printer.readline():
                continue

        self._printer_lock.release()


class HeaterTemperatureReader(object):

    def __init__(self, addr):
        self._heater = channel.Channel(addr, 'Sub', False)
        self._thread = Thread(target=self._update_temperature)
        self._thread.daemon = True
        self._thread.start()
        self._heater_temperature = _AtomicValue(0)

    def __del__(self):
        self._stop_flag = True
        self._thread.join()

    def _update_temperature(self):
        while self._stop_flag is not True:
            heater_status = self._heater.recv()
            self._heater_temperature.value = heater_status['temperature']

    def read(self):
        return self._heater_temperature.value


class OutputTemperatureReader(object):

    def __init__(self, addr):
        self._output = channel.Channel(addr, 'Sub', False)
        self._thread = Thread(target=self._update_temperature)
        self._thread.daemon = True
        self._thread.start()
        self._output_temperature = _AtomicValue(0)

    def __del__(self):
        self._stop_flag = True
        self._thread.join()

    def _update_temperature(self):
        while self._stop_flag is not True:
            output_status = self._output.recv()
            self._output_temperature.value = output_status['temperature']

    def read(self):
        return self._output_temperature.value

    def stop(self):
        self._stop_flag = True


class ColdTemperatureReader(object):

    def __init__(self):
        pass

    def read(self):
        return CONST_COLD_TEMPERATURE


class _TemperatureMixer(object):

    def __init__(self,
                 output_temp_reader,
                 heater_temp_reader,
                 cold_temp_reader):
        self._output_temp_reader = output_temp_reader
        self._heater_temp_reader = heater_temp_reader
        self._cold_temp_reader = cold_temp_reader

    def __del__(self):
        self._stop()

    def _calibrate(self, expect_t):
        pass

    def _group_points(self, points):
        water_sum = 0
        boundary = 0
        for index, point in enumerate(points):
            if 'e' in point:
                water_sum += point['e']
                if water_sum > CONST_ML:
                    boundary = index
                    break

        boundary = boundary + 1
        points_set = points[:boundary]
        points = points[boundary:]

        return (points_set, points)

    def _mix(self, points):
        point_pairs = []
        cold_t = self._cold_temp_reader.read()
        hot_t = self._heater_temp_reader.read()
        out_t = self._output_temp_reader.read()

        for point in points:
            point_pair = [copy.deepcopy(point), copy.deepcopy(point)]
            if ('e' in point) and ('t' in point):
                ratio = _calculate_ratio(point['t'], hot_t, cold_t, out_t)
                point_pair[0]['e'] = point_pair[0]['e'] * ratio
                point_pair[1]['e'] = point['e'] - point_pair[0]['e']
            else:
                point_pairs[1].pop('e')
        return point_pairs

    def _send(self, printer, point_pairs):
        gcodes = []
        for point in point_pairs:
            hot_gcode = _point_to_gcode(point[0])
            cold_gcode = _point_to_gcode(point[1])
            gcodes.append([hot_gcode, cold_gcode])

        for gcode in gcodes:
            printer.send_gcodes(gcode[0], gcode[1])

    def mix(self, printer, points):
        remains_points = points
        while True:
            (point_group, remains_points) = self._group_points(remains_points)
            point_pairs = self._mix(point_group)
            self._send(printer, point_pairs)

            if len(remains_points) == 0:
                break


class PrinterServer(object):

    def __init__(self,
                 config,
                 output_temp_reader,
                 heater_temp_reader,
                 cold_temp_reader,
                 printer_controller):

        # Create nanomsg socket to publish status and receive command
        pub_address = config['PrinterServer']['Publish_Socket_Address']
        self.pub_channel = channel.Channel(pub_address, 'Pub', True)
        logger.info('Create the publish channel at {}'.format(pub_address))

        # Receive the printer command
        cmd_address = config['PrinterServer']['Command_Socket_Address']
        self.cmd_channel = channel.Channel(cmd_address, 'Pair', True)
        logger.info('Create the command channel at {}'.format(cmd_address))

        self._printer_controller = printer_controller
        self._temperature_mixer = _TemperatureMixer(
                output_temp_reader=output_temp_reader,
                heater_temp_reader=heater_temp_reader,
                cold_temp_reader=cold_temp_reader)

        self._callback = self

        self._stop_flag = False
        self._point_queue = Queue.Queue()
        self._thread = Thread(target=self._start)
        self._thread.daemon = True
        self._thread.start()

    def __del__(self):
        self.close()

    def mcProgress(self, lineNr):
        self.pub_channel.send({'progress': lineNr})

    # ================================================================================
    #
    #   Printer Server API
    #
    # ================================================================================

    def stop(self):
        self._stop_flag = True

    def close(self):
        self.stop()

    def _start(self):
        if self._printer_controller.connect() is not True:
            logger.error("Printer connect fail")
            return

        while self._stop_flag is not True:
            points = self._point_queue.get(True)
            logger.info(points)
            self._temperature_mixer.mix(self._printer_controller, points)

        self._printer_controller.disconnect()

    def start(self):
        while True:
            points = self.cmd_channel.recv()
            logger.info(points)

            if 'STOP' in points:
                self.stop()
            elif 'G' in points:
                self._point_queue.put(points['G'])
            elif 'C' in points:
                self._point_queue.put([points['C']])
            elif 'INFORMATION' in points:
                self.cmd_channel.send(
                    {
                        'state': self._comm.getState(),
                        'state_string': self._comm.getStateString()
                    })
            elif 'SHUTDOWN' in points:
                logger.info("Printer shutdown")
                break

if __name__ == '__main__':

    config = json_config.parse_json('config.json')

    if config['Emulator']:
        port_name = 'VIRTUAL'
        port_name2 = 'VIRTUAL'
    else:
        port_name = config['Printer']['PortName']
        port_name2 = config['Printer']['PortName2']

    baudrate = int(config['Printer']['Baudrate'])

    printer_controller = PrinterController(
            cold_config=PrinterConfig(port_name, baudrate),
            hot_config=PrinterConfig(port_name2, baudrate))

    server = PrinterServer(
            config=config,
            output_temp_reader=OutputTemperatureReader(
                config['OutputServer']['Publish_Socket_Address']),
            heater_temp_reader=HeaterTemperatureReader(
                config['HeaterServer']['Publish_Socket_Address']),
            cold_temp_reader=ColdTemperatureReader(),
            printer_controller=printer_controller
            )
    server.start()
