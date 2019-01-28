const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)

const users = []
const defaultStatus = 'ready'

//on connect one user
const onConnect = socket => {
  socket.on('enter', addUser)
  socket.on('updateUser', updateUser)
  socket.on('clearUsersStatus', clearUsersStatus)
}

io.on('connection', onConnect)


// add user
const addUser = ({ id, name }) => {
  const userAlreadyExists = users.find(user => user.id === id) 
  
  console.log('connected users:', users)
  
  if (!userAlreadyExists) {
    users.push({ 
      id, 
      name, 
      status: defaultStatus
    })
    console.log(`${name} connected.`)
  }
}


// update user
const updateUser = data => {
  const { name, status } = data

  users.forEach(user => {
    if (user.name === name) {
      user.status = status
    }
  })
}


// clear the users status
const clearUsersStatus = () =>
  users.forEach(user => user.status = defaultStatus)



// start server
http.listen(3000, function(){
  console.log('listening on http://localhost:3000')
})