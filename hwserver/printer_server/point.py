#!/usr/bin/env python
# -*- coding: utf-8 -*-


class Point(object):

    def __init__(self, params):
        self._params = params

    def __str__(self):
        return self.to_gcode()

    def to_gcode(self):

        if self.is_valid() is not True:
            return None

        if self.is_command() and self.name == 'home':
            return 'G28'

        if self._params['type'] == 'point':
            gcode = 'G1'
            if ('x' in self._params) and (self._params['x'] is not None):
                gcode += ' X{}'.format(self._params['x'])
            if ('y' in self._params) and (self._params['y'] is not None):
                gcode += ' Y{}'.format(self._params['y'])
            if ('z' in self._params) and (self._params['z'] is not None):
                gcode += ' Z{}'.format(self._params['z'])
            if ('e' in self._params) and (self._params['e'] is not None):
                gcode += ' E{}'.format(self._params['e'])
            if ('f' in self._params) and (self._params['f'] is not None):
                gcode += ' F{}'.format(self._params['f'])

            return gcode

        return None

    def is_valid(self):
        if self._params is None:
            return False
        if type(self._params) is not dict:
            return False
        if 'type' not in self._params:
            return False
        return True

    def is_point(self):
        if self.is_valid() is False:
            return False
        if self._params['type'] != 'point':
            return False

        return True

    def is_command(self):
        if self.is_valid() is False:
            return False
        if self._params['type'] != 'command':
            return False

        return True

    @property
    def x(self):
        if 'x' not in self._params:
            return None
        return self._params['x']

    @x.setter
    def x(self, v):
        self._params['x'] = v

    @property
    def y(self):
        if 'y' not in self._params:
            return None
        return self._params['y']

    @y.setter
    def y(self, v):
        self._params['y'] = v

    @property
    def z(self):
        if 'z' not in self._params:
            return None
        return self._params['z']

    @z.setter
    def z(self, v):
        self._params['z'] = v

    @property
    def t(self):
        if 't' not in self._params:
            return None
        return self._params['t']

    @t.setter
    def t(self, v):
        self._params['t'] = v

    @property
    def e(self):
        if 'e' not in self._params:
            return None
        return self._params['e']

    @e.setter
    def e(self, v):
        self._params['e'] = v

    @property
    def f(self):
        if 'f' not in self._params:
            return None
        return self._params['f']

    @f.setter
    def f(self, v):
        self._params['f'] = v

    @property
    def name(self):
        if 'name' not in self._params:
            return None
        return self._params['name']

    @property
    def type(self):
        if 'type' not in self._params:
            return None
        return self._params['type']

    @property
    def time(self):
        if self.name != 'wait':
            return 0
        return self._params['time']
