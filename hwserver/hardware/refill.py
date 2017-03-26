import time
from threading import Thread
import RPi.GPIO as GPIO

from utils import json_config

import logging
logger = logging.getLogger(__name__)


class Pin(object):

    def __init__(self, number):
        GPIO.setmode(GPIO.BOARD)

        self.number = number
        self.status = None

    def set_out(self):
        self.status = GPIO.OUT
        GPIO.setup(self.number, GPIO.OUT)
        return self

    def set_in(self, pull_up_down=None):
        self.status = GPIO.IN

        if pull_up_down:
            GPIO.setup(self.number, GPIO.PUD_DOWN)
        else:
            GPIO.setup(self.number, GPIO.IN)

        return self

    def output(self, enable):
        GPIO.output(self.number, enable)

    def input(self):
        return GPIO.input(self.number)

class Refill(object):

    stop = False

    def __init__(self, config):
        # Read Config
        self._config = config

        self.water_level_pin_out = None
        self.water_level_pin_in = None
        self.motor_pins = None
        self.motor_direct = None

    def open(self):
        pins = self._config['water_level_pin']
        self.water_level_pin_out = Pin(pins[0]).set_out()
        self.water_level_pin_in = Pin(pins[1]).set_in(pull_up_down=True)

        self.water_level_pin_out.output(True)
        logger.info('Set water level GPIO {} to OUT and {} to IN'.format(
            pins[0], pins[1]))

        # Refill motor
        pins = self._config['motor_pin']
        self.motor_pins = [
            Pin(pins[0]).set_out(), 
            Pin(pins[1]).set_out()
        ]

        self.motor_direct = self._config['motor_direct']

        logger.info('Set motor GPIO {} and {} to OUT'.format(
            pins[0], pins[1]))

    def close(self):
        self.water_level_pin_out.output(False)
        self.motor_pins[1].output(False)
        self.stop = False

    def is_water_full(self):
        logger.debug('Read water level from {}'.format(self.water_level_pin_in.number))
        if self.water_level_pin_in.input():
            return True
        else:
            return False

    def _rotate_motor(self, times):
        for index in range(0, times):
            self.motor_pins[0].output(True)
            time.sleep(0.0005)
            self.motor_pins[0].output(False)
            time.sleep(0.0005)

    def refill_water(self):
        self.motor_pins[1].output(self.motor_direct)

        try:
            while not self.is_water_full() and not self.stop:
                # Every 200 steps check water level and stop flag
                self._rotate_motor(200)
        finally:
            self.close()
