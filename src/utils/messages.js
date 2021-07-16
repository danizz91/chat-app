const generateMessage =  (username,text,updateStatus=1) =>{
    return{
        username,
        text,
        updateStatus,
        createdAt: new Date().getTime()
    }
}

const generateLocationMessage = (username,url) =>{
    return {
        username,
        url,
        createdAt: new Date().getTime()
    }
}


module.exports = {
    generateMessage,
    generateLocationMessage
}