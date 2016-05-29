from threading import Thread

from printer_server import PrinterServer
from heater_server import HeaterServer
from refill_server import RefillServer
from output_server import OutputServer 


class HWServer :
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

        # Use the main thread to execute printer server
        self.printer_server = PrinterServer()
        self.printer_server.start()

if __name__ == "__main__":
    hwserver = HWServer()
    hwserver.start()
