import time
import logging
import serial

import gevent
from gevent import socket

logger = logging.getLogger(__name__)

def execute_with_retry(fn, retry_times=3, *args, **kwargs):
    for count in range(0, retry_times):
        try:
            return fn(*args, **kwargs)
        except Exception as e:
            logger.error("Get exception when executing fn {}, try again - {}".format(fn.__name__, count))
            logger.error(e)

class RemoteSmoothie(object):

    def __init__(self, host, port):
        self._host = host
        self._port = port
        self._name = "{}:{}".format(self._host, self._port)

    def open(self):
        steps = ['Smoothie', 'ok']

        logger.info("Open remote serial '{}'".format(self._name))

        self._socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self._socket.connect((self._host, self._port))

        # Use G command to check it is alive or note
        self.write('G')
        if self.readline().strip() == 'ok':
            return True
        else:
            return False

    def close(self):
        self._socket.close()

    def readline(self):
        ret = self._socket.recv(1024)
        ret = ret.decode()

        logger.info('{} Recv: {}'.format(self._port, ret))

        return ret

    def _write(self, cmd):
        cmd = cmd + '\n'

        logger.debug("{} Write '{}'".format(self._port, cmd))
        self._socket.send(cmd.encode())

        return True

    def write(self, cmd, retry_times=2):
        execute_with_retry(self._write, retry_times, cmd)

if __name__ == "__main__":
    smooth = RemoteSmoothie("192.168.0.27", 16000)
    print(smooth.open())
    while True:
        cmd = input()

        if cmd == 'quite':
            break

        smooth.write(cmd)
        result = smooth.readline()
        print(result)

    smooth.close()