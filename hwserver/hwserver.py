from threading import Thread
from utils import json_config

from printer_server.server import PrinterServer
from printer_server.printer import PrinterController
from printer_server.temperature_reader import HeaterTemperatureReader, \
        OutputTemperatureReader, ColdTemperatureReader
from printer_server.pubsub.nanomsg_pubsub import NanomsgPublisher
from printer_server.reqrep.nanomsg_reqrep import NanomsgRequester, \
        NanomsgResponser
from utils.smoothie import Smoothie

from heater_server import HeaterServer
from refill_server import RefillServer
from output_server import OutputServer

from sys import path
from os.path import dirname as dir

path.append(dir(path[0]))


class HWServer:
    def __init__(self):
        self.workers = {}

    def __create_worker(self, target):
        worker = Thread(target=target.start)
        worker.daemon = True

        return worker

    def start(self):
        self.__create_worker(HeaterServer()).start()
        self.__create_worker(RefillServer()).start()
        self.__create_worker(OutputServer()).start()

        config = json_config.parse_json('config.json')

        if config['Emulator']:
            port_name = 'VIRTUAL'
            port_name2 = 'VIRTUAL'
        else:
            port_name = config['Printer']['PortName']
            port_name2 = config['Printer']['PortName2']

        baudrate = int(config['Printer']['Baudrate'])

        printer_controller = PrinterController(
                cold_driver=Smoothie(port_name, baudrate),
                hot_driver=Smoothie(port_name2, baudrate))

        # Use the main thread to execute printer server
        self.printer_server = PrinterServer(
                publisher=NanomsgPublisher(
                    config['PrinterServer']['Publish_Socket_Address']),
                responser=NanomsgResponser(
                    config['PrinterServer']['Command_Socket_Address']),
                output_temp_reader=OutputTemperatureReader(
                    config['OutputServer']['Publish_Socket_Address']),
                heater_temp_reader=HeaterTemperatureReader(
                    config['HeaterServer']['Publish_Socket_Address']),
                cold_temp_reader=ColdTemperatureReader(),
                printer_controller=printer_controller,
                refill_commander=NanomsgRequester(
                    config['RefillServer']['Command_Socket_Address'])
                )
        self.printer_server.start()

if __name__ == "__main__":
    hwserver = HWServer()
    hwserver.start()
