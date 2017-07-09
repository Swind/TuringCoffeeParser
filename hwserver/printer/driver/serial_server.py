import gevent
import gevent.socket
from gevent.server import StreamServer

from serial import Serial
from serial import SerialException

import logging

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG)

serial_path = "/dev/ttyACM0"
net_port = 16000
baudrate = 115200

def init_serial(port, baudrate, socket):
    serial = Serial(serial_path, baudrate, timeout=1, write_timeout=1)

    while True:
        try:
            logger.debug("SerialReader: Waiting serial readable")
            gevent.socket.wait_read(serial.fd, timeout=5)
            line = serial.readline()
            logger.debug("Flush all message in the serial")
            logger.info("Receive message from serial when opening the serial port")
        except Exception as e:
            logger.error(e)
            break

    logger.info("Init serial port successed.")
    return serial

def redirect(serial, socket):
    while True:
        logger.debug("SerialWriter: Readline from socket")
        line = socket.recv(1024)
        logger.debug("SerialWriter: Receive {} from net socket and send to serial...".format(line))

        if not line:
            logger.info('SerialWriter: The client connection is disconnected...')
            break

        serial.write(line)

        gevent.socket.wait_read(serial.fd, timeout=10)
        result = serial.read_all()
        logger.debug("SerialWriter: receive {} from Smoothie".format(result))

        socket.sendall(result)

    logger.info("SerialWriter: Close the serial connection...")
    serial.close()

    logger.info("SerialWriter: Close the net connection...")
    socket.close()


def serial_to_net(socket, address):
    logger.info("New connection from {}".format(address))
    serial = init_serial(serial_path, baudrate, socket)
    redirect(serial, socket)

if __name__ == '__main__':
    server = StreamServer(('0.0.0.0', net_port), serial_to_net)
    logger.info('Starting serial server on port {}'.format(net_port))
    server.serve_forever()

