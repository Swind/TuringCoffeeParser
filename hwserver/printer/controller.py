#!/usr/bin/env python
# -*- coding: utf-8 -*-

from threading import Lock
import logging
import time

logger = logging.getLogger(__name__)


class PrinterController(object):

    def __init__(self, hot_driver, cold_driver, remote_driver):
        self._hot_printer = hot_driver
        self._cold_printer = cold_driver
        self._remote_printer = remote_driver

    def connect(self):

        hot_resp = None
        if self._hot_printer.open() is not True:
            logger.error('Cannot open printer for hot water')
            return False

        if self._cold_printer.open() is not True:
            logger.error('Cannot open printer for cold water')
            return False

        if self._remote_printer.open() is not True:
            logger.error('Cannot open printer for remote printer')
            return False

        time.sleep(1)

        logger.info("Check the hot file is in hot smoothie board.")
        self._hot_printer.write("ls sd/type")
        hot_resp = self._hot_printer.readline()
        logger.info("ls sd/type: " + hot_resp)

        if "cold" in hot_resp:
            logger.warning("Find type/cold in hot printer, so switch the hot printer and cold printer port")
            self._hot_printer, self._cold_printer = self._cold_printer, self._hot_printer

        logger.info("Hot is {}".format(self._hot_printer._port))
        logger.info("Cold is {}".format(self._cold_printer._port))

        # HOME, Set Unit to Millimeters,
        # Set to Absolute Positioning, Set extruder to relative mode
        for cmd in ['G28', 'G21', 'G90', 'M83']:
            self.send_gcodes(cmd, cmd)

        return True

    def disconnect(self):
        self._hot_printer.close()
        self._cold_printer.close()
        self._remote_printer.close()

    def send_gcodes(self, hot_command=None, cold_command=None):

        if hot_command is not None:
            self._hot_printer.write(hot_command)
            self._remote_printer.write(hot_command)
        if cold_command is not None:
            self._cold_printer.write(cold_command)

        if hot_command is not None:
            while 'ok' not in self._hot_printer.readline():
                continue
            while 'ok' not in self._remote_printer.readline():
                continue

        if cold_command is not None:
            while 'ok' not in self._cold_printer.readline():
                continue
