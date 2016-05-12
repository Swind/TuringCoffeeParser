import mock
import monitor

mock_heater = None


def get_heater(config):
    if config['Emulator']:
        global mock_heater
        heater_emulator = mock.MockHeater(config['HeaterEmulator'])
        mock_heater = heater_emulator
        return heater_emulator
    else:
        import heater
        return heater.Heater(config['Heater']['pin'])

def get_refill(config):
    if config['Emulator']:
        return mock.MockRefill()
    else:
        import refill
        return refill.Refill()

def get_sensor(config, t):
    if config['Emulator']:
        return __get_mock_sensor_monitor()

    if t in config:
        return __get_sensor_monitor(config['Sensors'][t])
    else:
        return None

def __get_mock_sensor_monitor():
    global mock_heater
    return monitor.TemperatureMonitor(mock.MockSensor(mock_heater))

def __get_sensor_monitor(sensor_config):
    if sensor_config['type'] == 'PT100':
        import pt100
        return monitor.TemperatureMonitor(pt100.PT100(sensor_config['ce']))

    if sensor_config['type'] == 'MAX31855':
        import max31855
        return monitor.TemperatureMonitor(max31855.MAX31855(sensor_config['ce']))

    if sensor_config['type'] == 'MAX31856':
        import max31856
        return monitor.TemperatureMonitor(max31856.MAX31856(sensor_config['ce']))

    if sensor_config['type'] == 'MLX90615':
        import mlx90615
        return monitor.TemperatureMonitor(mlx90615.MLX90615())

    return None
