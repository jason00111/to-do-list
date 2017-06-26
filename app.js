const app = require('express')()
const bodyParser = require('body-parser')
const db = require('./database/database.js')

app.use(bodyParser.json())

app.post('/addToDo', (req, res) => {
  const task = req.body.task
  const userId = 1 // get from authentication or session or cookies or something
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
  const userId = 1 // get from authentication or session or cookies or something
  db.getToDosByUserId(userId)
})

app.listen(3000, () => console.log('listening on port 3000'))
