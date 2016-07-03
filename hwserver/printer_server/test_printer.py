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


def test_printer_normal_operations():

    c = MockDriver()
    h = MockDriver()
    ctrler = PrinterController(hot_driver=h, cold_driver=c)
    assert ctrler.connect() is True

    # After connecting, driver should recieve G28, G21, G90, and M83
    init_cmds = ['G28', 'G21', 'G90', 'M83']
    assert c.get_cmds() == init_cmds
    assert h.get_cmds() == init_cmds

    c.flush()
    h.flush()

    verified_gcode = 'G1 X0'
    ctrler.send_gcodes(hot_command=verified_gcode)
    assert h.get_cmds()[0] == verified_gcode
    assert len(c.get_cmds()) == 0

    c.flush()
    h.flush()

    verified_gcode = 'G1 X0'
    ctrler.send_gcodes(cold_command=verified_gcode)
    assert c.get_cmds()[0] == verified_gcode
    assert len(h.get_cmds()) == 0

    c.flush()
    h.flush()

    verified_gcode = 'G1 X0'
    ctrler.send_gcodes(hot_command=verified_gcode, cold_command=verified_gcode)
    assert c.get_cmds()[0] == verified_gcode
    assert h.get_cmds()[0] == verified_gcode

    ctrler.disconnect()
