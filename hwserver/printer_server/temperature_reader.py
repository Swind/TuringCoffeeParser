#!/usr/bin/env python
# -*- coding: utf-8 -*-

from reader import Reader
from pubsub.nanomsg_pubsub import NanomsgSubscriber

CONST_COLD_TEMPERATURE = 20


class HeaterTemperatureReader(Reader, NanomsgSubscriber):

    def __init__(self, addr):
        Reader.__init__(self)
        NanomsgSubscriber.__init__(self, addr)
        self._temperature = 0

    def update(self):
        msg = super(HeaterTemperatureReader, self).update()
        if msg is not None:
            self._temperature = msg['temperature']

    def read(self):
        return self._temperature


class OutputTemperatureReader(Reader, NanomsgSubscriber):

    def __init__(self, addr):
        Reader.__init__(self)
        NanomsgSubscriber.__init__(self, addr)
        self._temperature = 0

    def update(self):
        msg = super(OutputTemperatureReader, self).update()
        if msg is not None:
            self._temperature = msg['temperature']

    def read(self):
        return self._temperature


class ColdTemperatureReader(object):

    def __init__(self):
        pass

    def read(self):
        return CONST_COLD_TEMPERATURE
