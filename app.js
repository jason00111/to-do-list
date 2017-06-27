process.on('unhandledRejection', (reason, promise) => {
    console.log('Reason:', reason);
    console.log('Promise:', promise);
});

const app = require('express')()
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const db = require('./database/database.js')

require('ejs')
app.set('view engine', 'ejs')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cookieSession({
  name: 'user',
  keys: ['key1', 'key2']
}))

app.get('/', (req, res) => {
  if (req.session.userId) {
    db.getToDosByUserId(req.session.userId)
    .then(toDos =>
      res.render('toDoList', { toDos })
    )
  } else {
    res.render('home')
  }
})

app.get('/logout', (req, res) => {
  req.session = null
  res.redirect('/')
})

app.get('/login', (req, res) => {
  res.render('login', { invalid: false })
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
      res.redirect('/')
    } else {
      res.render('login', { invalid: true })
    }
  })
})

app.get('/signup', (req, res) => {
  res.render('signup', { existingUser: false })
})

app.post('/signup', (req, res) => {
  db.getAllUsers()
  .then(users => {
    const existingUser = users.filter(user => {
      return user.name === req.body.userName
    })[0]

    if (existingUser) {
      res.render('signup', { existingUser: true })
    } else {
      db.addUser(req.body.userName, req.body.password)
      .then(userId => {
        req.session.userId = userId
        res.redirect('/')
      })
    }
  })
})

app.post('/addToDo', (req, res) => {
  const task = req.body.task
  const userId = req.session.userId
  db.addToDo(userId, task)
  .then(() => {
    res.redirect('/')
  })
})

app.post('/deleteToDo', (req, res) => {
  const id = req.body.toDoId
  db.deleteToDoById(id)
  .then(() => {
    res.redirect('/')
  })
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
