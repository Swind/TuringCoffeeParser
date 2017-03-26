class PrinterDriver(object):

    def __init__(self):
        pass

    def open(self):
        raise NotImplementedError

    def close(self):
        raise NotImplementedError

    def readline(self):
        raise NotImplementedError

    def write(self):
        raise NotImplementedError
