process.on('unhandledRejection', (reason, promise) => {
    console.log('Reason:', reason);
    console.log('Promise:', promise);
});

const express = require('express')
const bodyParser = require('body-parser')
const db = require('./database/database.js')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const GitHubStrategy = require('passport-github2').Strategy
const LocalStrategy = require('passport-local').Strategy
const secrets = require('./secrets')

require('ejs')
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(require('cookie-parser')())
app.use(require('express-session')({
  secret: 'secret', resave: true, saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(function (id, done) {
  db.getUserById(id).then(user => done(null, user))
})

passport.use(new GitHubStrategy({
    clientID: secrets.clientId,
    clientSecret: secrets.clientSecret,
    callbackURL: "http://localhost:3000/auth/github/callback",
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, done) {

    db.getUserByGithubId(profile.id)
      .then(user => done(null, user))
  }
));

passport.use(new LocalStrategy(
  function (username, password, done) {
    db.getAllUsers()
    .then(users => {
      const foundUser = users.find(user => user.name === username)

      if (!foundUser) {
        done(null, false)
      } else {
        bcrypt.compare(password, foundUser.password, (err, validPass) =>
          {
            if (!validPass) {
              done(null, false)
            } else {
              done(null, foundUser)
            }
          }
        )
      }
    })
  }
))

app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/', (req, res) => {
  if (req.user) {
    db.getToDosByUserId(req.user.id)
    .then(toDos =>
      res.render('toDoList', { toDos })
    )
  } else {
    res.redirect('/login')
  }
})

app.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/login')
})

app.get('/login', (req, res) => {
  res.render('login', { invalid: false })
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}))

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
        .then(user => {
          req.login(user, err => res.redirect('/'))
        })
      })
    }
  })
})

app.post('/addToDo', (req, res) => {
  const task = req.body.task || null
  if (task) {
    const userId = req.user.id
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

app.listen(3000, () => console.log('listening on port 3000'))
