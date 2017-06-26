const app = require('express')()
const bodyParser = require('body-parser')
const db = require('./database/database.js')

app.use(bodyParser.json())

app.post('/addToDo', (req, res) => {
  const task = req.body.task
  const userId = 1 // get from authentication or session or cookies or something
  db.addToDo(userId, task) // then redirect to user's todo list page
})

app.listen(3000, () => console.log('listening on port 3000'))
