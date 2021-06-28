const users = []

const addUser = ({id,username,room}) =>{
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate the data
    if(!username || !room){
        return {
            error:'Username and room are required!'
        }
    }

    // Check for exisitin user
    const exisitingUser = users.find((user)=>{
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
    users.push(user)
    return {user}
}

const removeUser = (id) =>{
    const index = users.findIndex((user)=>{
        return user.id === id
    })
    if(index !== -1){
        return users.splice(index,1)[0]
    }

}

const getUser = (id)=>{
    const user = users.find((user)=>{
        return user.id === id
    })
    return user
}

const getUsersInRoom = (room) =>{
    room = room.trim().toLowerCase()
    const sameRoom = users.filter((user)=>{
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
