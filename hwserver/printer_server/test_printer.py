import pytest

from driver.printer_driver import PrinterDriver
from printer import PrinterController


class MockDriver(PrinterDriver):

    def __init__(self):
        self._cmds = []

    def open(self):
        return True

    def close(self):
        pass

    def readline(self):
        return 'ok'

    def write(self, c):
        self._cmds.append(c)

    def flush(self):
        self._cmds = []

    def get_cmds(self):
        return self._cmds


@pytest.fixture
def ctrler():
    c = MockDriver()
    h = MockDriver()
    ctrler = PrinterController(hot_driver=h, cold_driver=c)
    return {'c': c, 'h': h, 'ctrler': ctrler}


def test_printer_connect(ctrler):
    assert ctrler['ctrler'].connect() is True

    # After connecting, driver should recieve G28, G21, G90, and M83
    init_cmds = ['G28', 'G21', 'G90', 'M83']
    assert ctrler['c'].get_cmds() == init_cmds
    assert ctrler['h'].get_cmds() == init_cmds

    ctrler['ctrler'].disconnect()


def test_printer_with_cold(ctrler):

    ctrler['c'].flush()
    ctrler['h'].flush()

    verified_gcode = 'G1 X0'
    ctrler['ctrler'].send_gcodes(cold_command=verified_gcode)

    assert len(ctrler['c'].get_cmds()) == 1
    assert ctrler['c'].get_cmds()[0] == verified_gcode

    assert len(ctrler['h'].get_cmds()) == 0

    ctrler['ctrler'].disconnect()


def test_printer_with_hot(ctrler):

    ctrler['c'].flush()
    ctrler['h'].flush()

    verified_gcode = 'G1 X0'
    ctrler['ctrler'].send_gcodes(hot_command=verified_gcode)

    assert len(ctrler['c'].get_cmds()) == 0

    assert len(ctrler['h'].get_cmds()) == 1
    assert ctrler['h'].get_cmds()[0] == verified_gcode

    ctrler['ctrler'].disconnect()


def test_printer_with_both(ctrler):

    ctrler['c'].flush()
    ctrler['h'].flush()

    verified_gcode = 'G1 X0'
    ctrler['ctrler'].send_gcodes(
            cold_command=verified_gcode, hot_command=verified_gcode)

    assert len(ctrler['c'].get_cmds()) == 1
    assert ctrler['c'].get_cmds()[0] == verified_gcode

    assert len(ctrler['h'].get_cmds()) == 1
    assert ctrler['h'].get_cmds()[0] == verified_gcode

    ctrler['ctrler'].disconnect()
