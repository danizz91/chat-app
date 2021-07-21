const redis = require('redis');
const { promisifyAll } = require('bluebird');
const moment = require('moment')
const log = require('noogger');
const { v4: uuidv4 } = require('uuid');
const open = require('amqplib').connect('amqp://localhost');

promisifyAll(redis);

const queue = 'messageQueue';


const client = redis.createClient();

const getValueOfKeys = async (users) =>{
    const usersJSON = []
    for (let i = 0 ; i < users.length ; i++){
        const valueUser = await client.GETAsync(users[i])
        usersJSON.push(JSON.parse(valueUser))
    }
    return usersJSON
}

const createMessage = async (user_id,msgObj,room) =>{
    const key = `room:${room}:${user_id}:${uuidv4()}`
    await client.setAsync(key,JSON.stringify(msgObj))

    open.then(function(conn) {
        return conn.createChannel();
    }).then(function(ch) {
        return ch.assertQueue(queue).then(function(ok) {
            return ch.sendToQueue(queue, Buffer.from(JSON.stringify(msgObj)));
        });
    }).catch(console.warn);
}

const writeLog = async ()=> {
    open.then(function(conn) {
        return conn.createChannel();
    }).then(function(ch) {
        return ch.assertQueue(queue).then(function(ok) {
            return ch.consume(queue, function(message) {
                if (message !== null) {
                    const msgContent = JSON.parse(message.content.toString('utf8'))
                    const writeString = `[${moment(msgContent.createdAt).format('k:mm')}] ${msgContent.username}:${msgContent.text}`
                    log.notice(writeString)
                    ch.ack(message);
                }
            });
        });
    }).catch(console.warn);
}


const getAllMessage = async (room) =>{
    const key = `room:${room}:*`
    const keysList = await client.KEYSAsync(key)
    const valueList = await getValueOfKeys(keysList)
    return valueList
}

module.exports = {
    createMessage,
    getAllMessage,
    writeLog
}