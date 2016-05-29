
import time
from threading import Thread

from utils import json_config
from utils import channel

import hardware

import logging
logger = logging.getLogger(__name__)


class OutputServer(object):

    def __init__(self):
        # Read config
        self.config = json_config.parse_json('config.json')

        self.sensor = hardware.get_sensor(self.config, "output_temperature_sensor")

        # Create a socket to receive refill command
        cmd_address = self.config['OutputServer']['Command_Socket_Address']
        self.cmd_channel = channel.Channel(cmd_address, 'Pair', True)

        pub_address = self.config['OutputServer']['Publish_Socket_Address']
        self.pub_channel = channel.Channel(pub_address, 'Pub', True)

        self.publish_worker = Thread(target=self.publish_output_temperature)
        self.publish_worker.daemon = True

        self.pause = False

    def start(self):
        logger.info("Output server starting ...")
        self.sensor.start()
        logger.info("Output server start successfully...")

        self.publish_output_temperature();

    def publish_output_temperature(self):
        while True:
            records = self.sensor.get_records(1)

            total = 0
            if records:
                for record in records:
                    total = total + record[0]

                temperature = total / len(records)
            else:
                temperature = 0

            logger.debug({'temperature': temperature})
            self.pub_channel.send({'temperature': temperature})
            time.sleep(1)

if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    server = OutputServer()
    server.start()
