from reader import Reader
from server import RealTimeTemperatureMixer, PointStepRunner
from point import Point


class MockReader(Reader):

    def __init__(self):
        self.v = None

    def read(self):
        return self.v


class MockCtrler(object):

    def __init__(self):
        self.hot = []
        self.cold = []
        pass

    def send_gcodes(self, hot, cold):
        self.hot.append(hot)
        self.cold.append(cold)


def test_step_runner():

    ctrler = MockCtrler()
    stepper = PointStepRunner(ctrler)
    step_generator = stepper.step([
            [
                Point({'type': 'point', 'x': 0, 'y': 0}),
                Point({'type': 'point', 'x': 0, 'y': 0})
            ],
            [
                Point({'type': 'point', 'x': 0, 'y': 0}),
                Point({'type': 'point', 'x': 0, 'y': 0})
            ]
        ])

    step_generator.next()
    assert len(ctrler.hot) == 1
    assert len(ctrler.cold) == 1
    step_generator.next()
    assert len(ctrler.hot) == 2
    assert len(ctrler.cold) == 2


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
