from printer_driver import PrinterDriver


class VirtualPrinter(PrinterDriver):

    def __init__(self):
        pass

    def open(self):
        return True

    def close(self):
        pass

    def readline(self):
        return 'ok'

    def write(self, msg):
        print msg
