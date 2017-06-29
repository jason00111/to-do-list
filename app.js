process.on('unhandledRejection', (reason, promise) => {
    console.log('Reason:', reason);
    console.log('Promise:', promise);
});

const express = require('express')
const bodyParser = require('body-parser')
// const cookieSession = require('cookie-session')
const db = require('./database/database.js')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

require('ejs')
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(require('cookie-parser')())
app.use(require('express-session')({ secret: 'secret', resave: true, saveUninitialized: true }))

// app.use(cookieSession({
//   name: 'user',
//   keys: ['key1', 'key2']
// }))


app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(
  function (username, password, done) {
    console.log('in local strategy')
    db.getAllUsers()
    .then(users => {
      const foundUser = users.find(user => user.name === username)

      if (!foundUser) {
        console.log('couldnt find user')
        done(null, false)
      } else {
        bcrypt.compare(req.body.password, foundUser.password, (err, validPass) =>
          {
            if (!validPass) {
              console.log('invalid password')
              done(null, false)
            } else {
              console.log('valid password')
              // req.session.userId = foundUser.id
              done(null, foundUser)
            }
          }
        )
      }
    })
  }
))

passport.serializeUser(function (user, done) {
  console.log('in serialize')
  done(null, user.id)
})

passport.deserializeUser(function (id, done) {
  console.log('in deserialize')
  db.getUserById(id).then(user => done(null, user))
})

/*app.get('/', (req, res) => {
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
})*/

app.get('/passport', passport.authenticate('local', {
  successRedirect: '/success',
  failureRedirect: '/fail'
}))

/*app.post('/login', (req, res) => {
  db.getAllUsers()
  .then(users => {
    const foundUser = users.find(user => user.name === req.body.userName)

    if (!foundUser) {
      res.render('login', { invalid: true })
    } else {
      bcrypt.compare(req.body.password, foundUser.password, (err, validPass) =>
        {
          if (!validPass) {
            res.render('login', { invalid: true })
          } else {
            req.session.userId = foundUser.id
            res.redirect('/')
          }
        }
      )
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
      bcrypt.hash(req.body.password, 12, (err, hashedPassword) => {
        db.addUser(req.body.userName, hashedPassword)
        .then(userId => {
          req.session.userId = userId
          res.redirect('/')
        })
      })
    }
  })
})

app.post('/addToDo', (req, res) => {
  const task = req.body.task || null
  if (task) {
    const userId = req.session.userId
    db.addToDo(userId, task)
    .then(() => {
      res.redirect('/')
    })
  } else {
    res.redirect('/')
  }
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

app.post('/toggleCompleteness', (req, res) => {
  const id = req.body.toDoId
  db.toggleCompletenessById(id)
  .then(() => {
    res.redirect('/')
  })
})

app.post('/editToDo', (req, res) => {
  const id = req.body.toDoId
  const task = req.body.task
  db.editToDoById(id, task)
  .then(() => {
    res.redirect('/')
  })
})

app.get('/getToDos', (req, res) => {
  const userId = req.session.userId
  db.getToDosByUserId(userId)
})*/

app.listen(3000, () => console.log('listening on port 3000'))
