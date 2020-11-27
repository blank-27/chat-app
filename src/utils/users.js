const users = []

const addUser = ({id,username,room}) => {

    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if(!username || !room){
        return {
            error:"username and room are required 'kaha jana hai bhai'"
        }
    }

    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    if(existingUser){
        return {
            error:"User name already exist 'salle imposter'"
        }
    }

    const user = {id,username,room}
    users.push(user)

    return {user}
}

const removeUser = (id) =>{
    const index = users.findIndex(user => user.id === id)

    if(index!==-1){
        return users.splice(index,1)[0]
    }
}


const getUser = (id) =>  {
    const index = users.findIndex(user => user.id === id)

    if(index!==-1){
        return users[index]
    }else{
        return {
            error:"No one exit with this name"
        }
    }
}


const getUsersInRoom = room =>{
    room = room.trim().toLowerCase()
    const roomUsers = users.filter(user => user.room ===room)
    return roomUsers
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}