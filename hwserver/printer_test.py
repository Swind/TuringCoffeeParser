from utils import channel
from printer_server import PrinterServer
from threading import Lock, Thread
import time
import logging


class GCODE_G1:

    @staticmethod
    def parse_axis(axis, string, end_with):
        len_of_axis = len(axis)
        start_axis = string.find(axis) + len_of_axis
        end_axis = string.find(end_with, start_axis)
        if end_axis == -1:
            end_axis = len(string)
        return float(string[start_axis:end_axis])

    @staticmethod
    def parse(string):
        if 'G1' not in string:
            return None

        x = y = z = e1 = e2 = f = None

        if 'X' in string:
            x = GCODE_G1.parse_axis('X', string, ' ')
        if 'Y' in string:
            y = GCODE_G1.parse_axis('Y', string, ' ')
        if 'Z' in string:
            z = GCODE_G1.parse_axis('Z', string, ' ')
        if 'E1' in string:
            e1 = GCODE_G1.parse_axis('E1', string, ' ')
        if 'E2' in string:
            e2 = GCODE_G1.parse_axis('E2', string, ' ')
        if 'F' in string:
            f = GCODE_G1.parse_axis('F', string, '\n')

        return GCODE_G1(x, y, z, e1, e2, f)

    def __init__(self, x=None, y=None, z=None, e1=None, e2=None, f=None):
        self.x = x
        self.y = y
        self.z = z
        self.e1 = e1
        self.e2 = e2
        self.f = f

    def __str__(self):
        gcode = 'G1'
        if self.x is not None:
            gcode = gcode + ' X{}'.format(self.x)

        if self.y is not None:
            gcode = gcode + ' Y{}'.format(self.y)

        if self.z is not None:
            gcode = gcode + ' Z{}'.format(self.z)

        if self.e1 is not None:
            gcode = gcode + ' E{}'.format(self.e1)

        if self.e2 is not None:
            gcode = gcode + ' E{}'.format(self.e2)

        if self.f is not None:
            gcode = gcode + ' F{}'.format(self.f)

        return gcode



class MockReader(object):

    def __init__(self):
        self._t = 0

    def read(self):
        return self._t

    def set_temperature(self, t):
        self._t = t


class MockPrinterController(object):

    def __init__(self):
        self.hot_gcodes = []
        self.cold_gocdes = []
        pass

    def connect(self):
        return True

    def disconnect(self):
        pass

    def send_gcodes(self, hot, cold):
        print 'hot: {} cold {}'.format(hot, cold)
        self.hot_gcodes.append(hot)
        self.cold_gocdes.append(cold)


class PrinterServerRunner(object):

    def __init__(self, server):
        self._server = server
        self._thread = Thread(target=self._server.start)
        self._thread.daemon = True

    def run(self):
        self._thread.start()

    def stop(self):
        self._thread.join()


def printer_test():
    config = {
            'PrinterServer': {
                'Publish_Socket_Address': 'ipc:///tmp/printer_server_pub',
                'Command_Socket_Address': 'ipc:///tmp/printer_server_cmd'
            }
    }
    out = MockReader()
    heater = MockReader()
    cold = MockReader()
    controller = MockPrinterController()
    p = PrinterServer(config, out, heater, cold, controller)
    runner = PrinterServerRunner(p)
    runner.run()

    addr = 'ipc:///tmp/printer_server_cmd'
    chan = channel.Channel(addr, 'Pair', False)

    out.set_temperature(20)
    heater.set_temperature(90)
    cold.set_temperature(20)

    chan.send(
            {'G': [
                {'e': 10, 'f': 100, 't': 50},
                {'e': 10, 'f': 100, 't': 50},
                {'e': 10, 'f': 100, 't': 50}
            ]})

    time.sleep(1)

    out.set_temperature(50)
    heater.set_temperature(90)
    cold.set_temperature(20)

    chan.send(
            {'G': [
                {'e': 10, 'f': 100, 't': 50},
                {'e': 10, 'f': 100, 't': 50},
                {'e': 10, 'f': 100, 't': 50}
            ]})

    time.sleep(1)
    chan.send({'SHUTDOWN': ''})
    runner.stop()

if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO, format='[%(levelname)s] %(asctime)s - %(message)s')
    printer_test()
