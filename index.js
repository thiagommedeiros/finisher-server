const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)

const users = []
const defaultStatus = 'ready'


//on connect one user
const onConnect = socket => {

  // add user
  const addUser = ({ id, name }) => {
    const userAlreadyExists = users.find(user => user.id === id) 
    
    if (!userAlreadyExists) {
      if (name === 'Professor Thiago' || name === 'Professor Thomaz') {
        socket.emit('isAdmin', true)

        console.log(`Admin ${name} is connected.`)

        return
      }

      users.push({
        id, 
        name, 
        status: defaultStatus
      })

      console.log(`User ${name} is connected.`)
      
      emitUsersState()
    }
  }


  // update user
  const updateUser = data => {
    const { id, status } = data

    users.forEach(user => {
      if (user.id === id) {
        user.status = status
      }
    })

    emitUsersState()
  }


  // emit users state
  const emitUsersState = () => {
    console.log('Actual state:', users)

    socket.broadcast.emit('usersState', users)
    
    socket.emit('usersState', users)
  }


  // clear the users status
  const clearUsersStatus = () => {
    users.forEach(user => user.status = defaultStatus)
    
    socket.broadcast.emit('usersReady', true)
    
    emitUsersState()
  }

  
  // remove user
  const removeUser = data => {
    const { id } = data

    users.forEach((user, index) => {
      if (user.id === id) {
        users.splice(index, 1)

        console.log(`User ${user.name} is disconnected.`)
        
        emitUsersState()
      }
    })
  }

  socket.on('enter', addUser)
  socket.on('exit', removeUser)
  socket.on('updateUser', updateUser)
  socket.on('clearUsersStatus', clearUsersStatus)
}

io.on('connection', onConnect)



// start server
http.listen(3000, function(){
  console.log('listening on http://localhost:3000')
})