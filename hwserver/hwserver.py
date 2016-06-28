from threading import Thread
from utils import json_config

from printer_server import PrinterServer, PrinterConfig, PrinterController, \
        OutputTemperatureReader, HeaterTemperatureReader, ColdTemperatureReader
from heater_server import HeaterServer
from refill_server import RefillServer
from output_server import OutputServer


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
                cold_config=PrinterConfig(port_name, baudrate),
                hot_config=PrinterConfig(port_name2, baudrate))

        # Use the main thread to execute printer server
        self.printer_server = PrinterServer(
                config=config,
                output_temp_reader=OutputTemperatureReader(
                    config['OutputServer']['Publish_Socket_Address']),
                heater_temp_reader=HeaterTemperatureReader(
                    config['HeaterServer']['Publish_Socket_Address']),
                cold_temp_reader=ColdTemperatureReader(),
                printer_controller=printer_controller
                )
        self.printer_server.start()

if __name__ == "__main__":
    hwserver = HWServer()
    hwserver.start()
