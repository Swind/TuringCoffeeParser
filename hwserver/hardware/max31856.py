import time
import logging
import spidev

from temperature_sensor import TemperatureSensor, SensorBorkenError

logger = logging.getLogger(__name__)


class MAX31856(TemperatureSensor):

    def __init__(self, number):
        self._cs = cs   # spi chip select number

    def readRegister(self, reg_num, byte):
        self.spi.xfer([reg_num])
        buf = self.spi.readbytes(17)
        return buf[reg_num+1:reg_num+1+byte]

    def writeRegister(self, reg_num, data):
        address_byte = 0x80 | reg_num
        self.spi.xfer([address_byte, data])

    def requestTempConv(self):
        self.writeRegister(0, 0x42)
        time.sleep(.2)

    def open(self):
        self.spi = spidev.SpiDev()
        self.spi.open(0, self._cs)
        self.spi.max_speed_hz = 100000
        self.spi.mode = 1
        self.writeRegister(1, 0x07)   # t-type
        time.sleep(1)

    def close(self):
        self.spi.close()
        self.spi = None

    def read(self):

        self.requestTempConv()
        out = self.readRegister(0x0c, 4)

        [tc_highByte, tc_middleByte, tc_lowByte] = [out[0], out[1], out[2]]
        temp = ((tc_highByte << 16) | (tc_middleByte << 8) | tc_lowByte) >> 5

        if (tc_highByte & 0x80):
            temp -= 0x80000

        temp_C = temp * 0.0078125

        fault = out[3]

        if ((fault & 0x80)):
            logger.error("Cold Junction Out-of-Range")
            raise SensorBorkenError("Cold Junction Out-of-Range")
        if ((fault & 0x40)):
            logger.error("Thermocouple Out-of-Range")
            raise SensorBorkenError("Thermocouple Out-of-Range")
        if ((fault & 0x20)):
            logger.error("Cold-Junction High Fault")
            raise SensorBorkenError("Cold-Junction High Fault")
        if ((fault & 0x10)):
            logger.error("Cold-Junction Low Fault")
            raise SensorBorkenError("Cold-Junction Low Fault")
        if ((fault & 0x08)):
            logger.error("Thermocouple Temperature High Fault")
            raise SensorBorkenError("Thermocouple Temperature High Fault")
        if ((fault & 0x04)):
            logger.error("Thermocouple Temperature Low Fault")
            raise SensorBorkenError("Thermocouple Temperature Low Fault")
        if ((fault & 0x02)):
            logger.error("Overvoltage or Undervoltage Input Fault")
            raise SensorBorkenError("Overvoltage or Undervoltage Input Fault")
        if ((fault & 0x01)):
            logger.error("Thermocouple Open-Circuit Fault")
            raise SensorBorkenError("Thermocouple Open-Circuit Fault")

        return temp_C
