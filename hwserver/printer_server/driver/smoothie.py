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

    def open(self, retry_times=3):
        for count in range(0, retry_times):
            try:
                logger.info('Open serial \'{}\' with baudrate \'{}\''.format(self._port, self._baudrate))
                self._serial = serial.Serial(str(self._port), self._baudrate, timeout=5, writeTimeout=10000)
            
                # The first message should be 'Smoothie', if not open the serial again
                if self.readline().strip() != 'Smoothie':
                    continue

                # The second message should be 'ok', if not open the serial again
                if self.readline().strip() != "ok":
                    continue

                return True
            except serial.SerialException:
                logger.exception('Unexpected error while connecting to serial')
                return False

        logger.error("Can't receives the message 'Smoothie' and 'ok' from Smoothie board after retry {} times".format(retry_times))
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

if __name__ == "__main__":
     smooth = Smoothie("/dev/ttyACM0", 115200)
     print smooth.open()
     smooth.close()
