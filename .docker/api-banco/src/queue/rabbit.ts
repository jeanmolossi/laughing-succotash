import { Channel, connect, ConsumeMessage } from 'amqplib';

type Callback = (message: string) => Promise<void> | void;

export class RabbitMQ {
	private readonly queueName;
	private connection;
	private channel;

	constructor(queueName = "transactions") {
		const connection = connect('amqp://guest:guest@d_banco-fila?channelMax=65535');

		this.queueName = queueName
		this.connection = connection
		this.channel = connection.then(conn => conn.createChannel())
	}

	getChannel = () => {
		return this.channel.then(function (channel: Channel) {
			return channel
		})
	}

	getQueue = (channel: Channel) => {
		return channel.assertQueue(this.queueName)
			.then(() => channel)
	}

	consume = (callback: Callback) => {
		this.getChannel()
			.then(this.getQueue)
			.then((channel: Channel) => {
				channel.consume(this.queueName, async(msg: ConsumeMessage | null) => {
					if (msg !== null) {
						try {
							console.log("Reading...")
							await callback(msg.content.toString())
							channel.ack(msg)
						} catch (e: any) {
							channel.nack(msg, false, true)
							console.log("Rabbit com erro " + e.message)
						}
					}
				})
			})
	}
}