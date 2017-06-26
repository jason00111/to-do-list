const app = require('express')()
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const db = require('./database/database.js')

app.use(bodyParser.json())

app.use(cookieSession({
  name: 'user',
  keys: ['key1', 'key2']
}))

app.get('/login', (req, res) => {
  res.render()
})

app.post('/login', (req, res) => {
  db.getAllUsers()
  .then(users => {
    const verifiedUser = users.filter(user => {
      return user.name === req.body.userName &&
        user.password === req.body.password
    })[0]

    if (verifiedUser) {
      req.session.userId = verifiedUser.id
    } else {
      // error
      console.error('no verification')
    }
  })
})

app.post('/addToDo', (req, res) => {
  const task = req.body.task
  const userId = req.session.userId
  db.addToDo(userId, task) // then redirect to user's todo list page
})

app.post('/delelteToDo', (req, res) => {
  const id = req.body.toDoId
  db.deleteToDoById(id)
})

app.post('/completeToDo', (req, res) => {
  const id = req.body.toDoId
  db.completeToDoById(id)
})

app.post('/uncompleteToDo', (req, res) => {
  const id = req.body.toDoId
  db.uncompleteToDoById(id)
})

app.post('/editToDo', (req, res) => {
  const id = req.body.toDoId
  const task = req.body.task
  db.editToDoById(id, task)
})

app.get('/getToDos', (req, res) => {
  const userId = req.session.userId
  db.getToDosByUserId(userId)
})

app.listen(3000, () => console.log('listening on port 3000'))
