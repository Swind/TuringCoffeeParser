#!/usr/bin/env python
# -*- coding: utf-8 -*-


class Requester(object):

    def __init__(self):
        pass

    def req(self, msg):
        raise NotImplementedError

    def recv(self):
        raise NotImplementedError


class Responser(object):

    def __init__(self):
        pass

    def rep(self, msg):
        raise NotImplementedError

    def recv(self):
        raise NotImplementedError
