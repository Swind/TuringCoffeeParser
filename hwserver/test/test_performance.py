from hwserver.utils.channel import Channel

class Producer:
    def __init__(self, channel):
        self.channel = channel

    def test(self, times=1000):
        for count in range(0, times):
            self.channel.send(count)
            result = self.channel.recv()
            print(result)

class Consumer:
    def __init__(self, channel):
        self.channel = channel

    def start(self):
        while True:
            result = self.channel.recv()
            self.channel.send(result)

def start_producer():
    channel = Channel("tcp://192.168.1.27:5555", 'Pair', is_server=False)
    producer = Producer(channel)
    producer.test()

def start_consumer():
    channel = Channel("tcp://*:5555", "Pair", is_server=True)
    consumer = Consumer(channel)
    consumer.start()

#start_producer()
#start_consumer()
