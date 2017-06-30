const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')

const app = require('./app')
const db = require('./database/database')

chai.use(chaiHttp)

const agent = chai.request.agent(app)

describe('if the user is not logged in', () => {
  it('the homepage works', done => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200)
        expect(res).to.redirectTo('http://' + res.request.host + '/login')
        done()
      })
  })

  it('user can log in', done => {
    chai.request(app)
      .post('/login')
      .send({ username: 'aaron', password: 'aaron' })
      .end((err, res) => {
        expect(res).to.have.status(200)
        expect(res).to.be.html
        done()
      })
  })
})

describe('if the user is logged in', () => {
  it('the homepage works', done => {
    agent
      .post('/login')
      .send({ username: 'aaron', password: 'aaron' })
      .then(() => {
        agent
          .get('/')
          .end((err, res) => {
            expect(res).to.have.status(200)
            expect(res).to.be.html
            expect(res).to.not.redirect
            done()
          })
      })
  })

  it('the homepage works', done => {
    agent
      .post('/login')
      .send({ username: 'aaron', password: 'aaron' })
      .then(() => {
        agent
          .get('/logout')
          .end((err, res) => {
            expect(res).to.have.status(200)
            expect(res).to.redirectTo('http://' + res.request.host + '/login')
            agent
              .get('/')
              .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res).to.redirectTo('http://' + res.request.host + '/login')
                done()
              })
          })
      })
  })
})

describe('database', () => {
  it('/addToDo route works', done => {
    agent
      .post('/login')
      .send({ username: 'aaron', password: 'aaron' })
      .then(() => {
        agent
          .post('/addToDo')
          .send({ task: 'build a house' })
          .end((err, res) => {
            expect(res).to.have.status(200)
            expect(res).to.redirectTo('http://' + res.request.host + '/')
            db.get.toDosByUserId(2)
              .then(todos => {
                expect(todos.find(todo => todo.task = 'build a house')).to.not.be.undefined
                done()
              })
          })
      })
  })
})
