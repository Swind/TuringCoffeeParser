from reader import Reader
from server import RealTimeTemperatureMixer
from point import Point


class MockReader(Reader):

    def __init__(self):
        self.v = None

    def read(self):
        return self.v


def test_mixer_with_points():
    output = MockReader()
    heater = MockReader()
    cold = MockReader()

    points = [
            Point({'type': 'point', 'x': 0, 'y': 0, 'e': 10}),
            Point({'type': 'point', 'x': 0, 'y': 0, 'e': 10})
            ]

    mixer = RealTimeTemperatureMixer(output, heater, cold)
    pairs_generator = mixer.mix(points)
    pairs = pairs_generator.next()
    assert len(pairs) == 2
