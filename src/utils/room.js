const redis = require('redis');
const { promisifyAll } = require('bluebird');
const { v4: uuidv4 } = require('uuid');
const amqp = require('amqplib/callback_api');

promisifyAll(redis);


const client = redis.createClient({
    port      : 6379,
    host      : 'redis'
});

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

    amqp.connect('amqp://rabbitmq:5672',(err,conn)=>{
        if(err){
            return console.log("Cannot connect RabbitMq")
        }
        conn.createChannel((err,ch)=>{
            let queue = 'messageQueue';
            ch.assertQueue(queue,{durable:false})
            ch.sendToQueue(queue, Buffer.from(JSON.stringify(msgObj)))
            console.log('Message was sent to queue!');
        })
        setTimeout(()=>{
            conn.close();
        },500)
    })
    // Send to rabbit mq also!
}

const getAllMessage = async (room) =>{
    const key = `room:${room}:*`
    const keysList = await client.KEYSAsync(key)
    const valueList = await getValueOfKeys(keysList)
    return valueList
}

module.exports = {
    createMessage,
    getAllMessage
}