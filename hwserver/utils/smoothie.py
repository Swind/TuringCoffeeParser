import time
import logging
import serial

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class VirtualPrinter(object):

    def __init__(self):
        pass

    def readline(self):
        return 'ok'

    def write(self, msg):
        print msg


class Smoothie(object):

    def __init__(self, port=None, baudrate=None):
        self._port = port
        self._baudrate = baudrate
        self._serial = None

    def __del__(self):
        if self._serial is not None:
            self._serial.close()

    def open(self, retry_times=3):
        try:
            if self._port == 'VIRTUAL':
                self._serial = VirtualPrinter()
            else:
                for count in range(0, retry_times):
                    try:
                        logger.info('Open serial \'{}\' with baudrate \'{}\''.format(self._port, self._baudrate))
                        self._serial = serial.Serial(str(self._port), self._baudrate, timeout=5, writeTimeout=10000)

                        # Handle sometimes smoothie board doesn't output anything, use G command to check it is alive or note
                        line = self.readline().strip()
                        if line == '':
                            self.write('G')
                            if self.readline().strip() == 'ok':
                                return True

                        # The first message should be 'Smoothie', if not open the serial again
                        if line != 'Smoothie':
                            self._serial.close()
                            continue

                        # The second message should be 'ok', if not open the serial again
                        if self.readline().strip() != "ok":
                            self._serial.close()
                            continue

                        return True
                    except serial.SerialException:
                        logger.exception('Unexpected error while connecting to serial')
                        return False

            logger.error("Can't receives the message 'Smoothie' and 'ok' from Smoothie board after retry {} times".format(retry_times))
            return False
        except serial.SerialException:
            logger.exception('Unexpected error while connecting to serial')
            return False

    def close(self):
        if self._port == 'VIRTUAL':
            self._serial = None
        else:
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
    smooth = Smoothie("/dev/ttyACM1", 115200)
    print smooth.open()
    try:
        while(True):
            cmd = raw_input(">")
            if(cmd=="exit"):
                break;
        smooth.write(cmd)
        print(smooth.readline())
        """
        import time
        for index in range(0, 1000):
       for count in range(0, 10):
           smooth.write("G0 E0.001 F1")
       time.sleep(0.1)
        """
    finally:
        smooth.close()
