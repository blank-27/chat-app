const genrateMessage = (username,text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}

const genrateLocationMessage = (username,text) =>{
    return {
        username,
        text,
        createdAt:new Date().getTime()
    }
}


module.exports = {
    genrateMessage,
    genrateLocationMessage
}