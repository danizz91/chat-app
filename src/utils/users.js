const redis = require('redis');
const { promisifyAll } = require('bluebird');

promisifyAll(redis);
const client = redis.createClient();

const toJSON = (obj) =>{
    return JSON.parse(obj)
}

const addUser = async ({id,username,room}) =>{
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate the data
    if(!username || !room){
        return {
            error:'Username and room are required!'
        }
    }
    try{
        const redislist = await client.lrangeAsync('Users',0,-1)
        const userlist = redislist.map(toJSON);
        // Check for exisitin user
        const exisitingUser = userlist.find((user)=>{
            return user.room === room && user.username === username
        })
        // Validate username
        if(exisitingUser){
            return {
                error: 'Username is in use!'
            }
        }
        // Store user
        const user = {id,username,room}
        await client.lpushAsync('Users',JSON.stringify(user))
        return {user}

    }catch (e){
        return {
            error:e
        }
    }

}

const getUser = async (id) =>{
    const redisList = await client.lrangeAsync('Users',0,-1);
    const userList = redisList.map(toJSON);
    const user = userList.find((user)=>{
        return user.id === id
    })
    return user
}

const removeUser = async (id) =>{
    const redisList = await client.lrangeAsync('Users',0,-1);
    const userList = redisList.map(toJSON);
    const user = userList.find((user)=>{
        return user.id === id
    })
    if (!user) {
        return {
            error: "Cannot find that user!"
        }
    }
    const stringUser = JSON.stringify(user)
    await client.lremAsync('Users',1,stringUser)
}

const getUsersInRoom = async (room) =>{
    room = room.trim().toLowerCase()
    const redisList = await client.lrangeAsync('Users',0,-1);
    const userList = redisList.map(toJSON);
    const sameRoom = userList.filter((user)=>{
        return user.room === room
    })
    return sameRoom
}


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}