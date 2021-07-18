const redis = require('redis');
const { promisifyAll } = require('bluebird');

promisifyAll(redis);
const client = redis.createClient();

const toJSON = (obj) =>{
    return JSON.parse(obj)
}

const getValueOfKeys = async (users) =>{
    const usersJSON = []
    for (let i = 0 ; i < users.length ; i++){
        const valueUser = await client.GETAsync(users[i])
        usersJSON.push(JSON.parse(valueUser))
    }
    return usersJSON
}

const addUser = async ({id,username,room}) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    try{
        const users = await client.KEYSAsync('*')
        const valueList = await getValueOfKeys(users)


        const exisitingUser = valueList.find((user)=>{
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
        await client.setAsync(`User:${id}`,JSON.stringify(user))
        return {user}
    }catch (e){
        return {
            error:e
        }
    }

}

const getUser = async (id) =>{
    try{
        const user = await client.getAsync(`User:${id}`);
        return JSON.parse(user)
    }catch (e){
        return {
            error:e
        }
    }
}

const removeUser = async (id) =>{
    try{
        const user = await client.delAsync(`User:${id}`);
        if(user < 0){
            return {
                error: "Cannot find that user!"
            }
        }
    }catch (e){
        return {
            error:e
        }
    }

}


const getUsersInRoom = async (room) =>{
    try{
        const users = await client.KEYSAsync('*')
        const valueList = await getValueOfKeys(users)
        const sameRoom = valueList.filter((user)=>{
            return user.room === room
        })
        return sameRoom

    }catch (e){
        return {
            error:e
        }
    }
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}