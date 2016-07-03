from point import Point


def test_point_no_type():
    p = Point({})
    assert p.is_valid() is False


def test_point_wrong_param_type():
    p = Point(1)
    assert p.is_valid() is False


def test_point_validate():
    p = Point({'type': 'point'})
    assert p.is_valid() is True


def test_is_point():
    p = Point({'type': 'point'})
    assert p.is_point() is True
    assert p.is_command() is False


def test_is_command():
    p = Point({'type': 'command'})
    assert p.is_point() is False
    assert p.is_command() is True


def test_is_not_a_validate_point():
    p = Point({'type': 'deadbeef'})
    assert p.is_point() is False
    assert p.is_command() is False


def test_home_command():
    p = Point({'type': 'command', 'name': 'home'})
    assert p.is_command() is True

    g = p.to_gcode()
    assert g == 'G28'


def test_wait_command():
    p = Point({'type': 'command', 'name': 'wait'})
    assert p.is_command() is True

    g = p.to_gcode()
    assert g is None


def test_point_to_gcode():
    p = Point({'type': 'point', 'x': 0, 'y': 0, 'z': 0, 'e': 0, 'f': 0})
    assert p.is_point() is True
    g = p.to_gcode()
    assert g == 'G1 X0 Y0 Z0 E0 F0'


def test_point_to_gcode_with_missing_field():
    p = Point({'type': 'point', 'x': 0, 'y': 0, 'z': 0, 'f': 0})
    assert p.is_point() is True
    g = p.to_gcode()
    assert g == 'G1 X0 Y0 Z0 F0'
