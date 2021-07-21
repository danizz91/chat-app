/*
const amqp = require('amqplib/callback_api');
const moment = require('moment')
const log = require('noogger');

const writeLog = async ()=> {
    amqp.connect('amqp://rabbitmq:5672', (err, conn) => {
        if (err) {
            return log.error("cannot connect RabbitMq")
        }
        conn.createChannel((err, ch) => {
            if(err){
                throw err
            }
            let queue = 'messageQueue';

            ch.assertQueue(queue, {durable: false})
            console.log(`Waiting for message in ${queue} `)
            ch.consume(queue, (message) => {
                const msgContent = JSON.parse(message.content.toString('utf8'))
                const writeString = `[${moment(msgContent.createdAt).format('k:mm')}] ${msgContent.username}:${msgContent.text}`
                log.notice(writeString)
            })
        }, {noAck: true})
    })
}



module.exports = {
    writeLog
}*/
