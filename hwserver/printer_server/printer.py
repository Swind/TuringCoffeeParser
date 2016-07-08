#!/usr/bin/env python
# -*- coding: utf-8 -*-

from threading import Lock
import logging

logger = logging.getLogger(__name__)


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


class PrinterController(object):

    def __init__(self, hot_driver, cold_driver):
        self._hot_printer = hot_driver
        self._cold_printer = cold_driver

        self._printer_lock = Lock()
        self.command_counter = _AtomicValue(0)

    def connect(self):
        if self._hot_printer.open() is not True:
            logger.error('Cannot open printer for hot water')
            return False
        if self._cold_printer.open() is not True:
            logger.error('Cannot open printer for cold water')
            return False

        # HOME, Set Unit to Millimeters,
        # Set to Absolute Positioning, Set extruder to relative mode
        for cmd in ['G28', 'G21', 'G90', 'M83']:
            self.send_gcodes(cmd, cmd)

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
