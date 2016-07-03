#!/usr/bin/env python
# -*- coding: utf-8 -*-

from pubsub import Publisher, Subscriber
from utils.channel import Channel


class NanomsgPublisher(Publisher):

    def __init__(self, addr):
        super(NanomsgPublisher, self)
        self.chan = Channel(addr, 'Pub', True)

    def pub(self, msg):
        self.chan.send(msg)


class NanomsgSubscriber(Subscriber):

    def __init__(self, addr):
        super(NanomsgSubscriber, self)
        self.chan = Channel(addr, 'Sub', False)

    def update(self):
        return self.chan.recv(blocking=False)
