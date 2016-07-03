import time
import logging
import serial

from printer_driver import PrinterDriver

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class Smoothie(PrinterDriver):

    def __init__(self, port=None, baudrate=None):
        self._port = port
        self._baudrate = baudrate
        self._serial = None

    def __del__(self):
        if self._serial is not None:
            self._serial.close()

    def open(self):
        try:
            logger.info('Open serial \'{}\' with baudrate \'{}\''.format(self._port, self._baudrate))
            self._serial = serial.Serial(str(self._port), self._baudrate, timeout=5, writeTimeout=10000)
            return True
        except serial.SerialException:
            logger.exception('Unexpected error while connecting to serial')
            return False

    def close(self):
        self._serial.close()

    def readline(self):
        if self._serial is None:
            return None
        try:
            ret = self._serial.readline()
        except:
            logger.exception('Unexpected error while reading serial')
            return None
        if ret == '':
            return ''
        logger.info('%s Recv: %s' % (self._port,
            unicode(ret, 'ascii', 'replace').encode('ascii', 'replace').rstrip()))
        return ret

    def write(self, cmd):
        if self._serial is None:
            return
        logger.info('{} Write \'{}\''.format(self._port, cmd))
        try:
            self._serial.write(cmd + '\n')
        except serial.SerialTimeoutException:
            logger.warning(
                'Serial timeout while writing to serial port, trying again.')
            try:
                time.sleep(0.5)
                self._serial_write(cmd + '\n')
            except:
                logger.exception('Unexpected error while writing serial')
                return False
        except:
            logger.exception('Unexpected error while writing serial')
            return False

        return True
