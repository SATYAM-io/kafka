import {Kafka} from 'kafkajs'

export const kafkaClient = new Kafka({
    clientId: 'Satyam',
    brokers: ['localhost:9092'],
})