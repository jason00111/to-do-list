const { expect } = require('chai')
const { get, del, add, update } = require('./database.js')

describe('database', () => {
  it('getToDosByUserId gets tasks by user id', () =>
    get.toDosByUserId(1)
      .then(results =>
        expect(results).to.be.an('array').with.lengthOf(1)
      )
  )

  it('addToDo adds a to-do', () =>
    add.toDo(1, 'buy bread')
      .then(() =>
        get.toDosByUserId(1)
          .then(results =>
            expect(results.some(
              element => element.task === 'buy bread'
            )).to.be.true
          )
      )
  )

  it('deleteToDoById deletes a to-do', () =>
    get.toDosByUserId(1)
      .then(results => {
        const tasks = results.filter(result => result.task === 'buy bread')
        expect(tasks).to.be.an('array').with.lengthOf(1)
        return del.toDoById(tasks[0].id)
          .then(() =>
            get.toDosByUserId(1)
              .then(results => {
                const tasks = results.filter(result => result.task === 'buy bread')
                return expect(tasks).to.be.an('array').with.lengthOf(0)
              })
          )
      })
  )

  /*  it('completeToDoById marks a to-do as complete', () =>
    getToDosByUserId(2)
    .then(results => {
      const task = results.filter(result =>
        result.task === 'make authentication')[0]
      expect(task.completed).to.be.false
      return completeToDoById(task.id)
      .then(() =>
        getToDosByUserId(2)
        .then(results => {
          const task = results.filter(result =>
            result.task === 'make authentication')[0]
          return expect(task.completed).to.be.true
        })
      )
    })
  )

  it('uncompleteToDoById marks a to-do as uncomplete', () =>
    getToDosByUserId(2)
    .then(results => {
      const task = results.filter(result =>
        result.task === 'make authentication')[0]
      expect(task.completed).to.be.true
      return uncompleteToDoById(task.id)
      .then(() =>
        getToDosByUserId(2)
        .then(results => {
          const task = results.filter(result =>
            result.task === 'make authentication')[0]
          return expect(task.completed).to.be.false
        })
      )
    })
  ) */

  it('update.toDoById changes the task text', () =>
    update.toDoById(1, 'grow flowers')
      .then(() =>
        get.toDoById(1)
          .then(result => expect(result.task).to.equal('grow flowers'))
      )
  )

  it('addUser adds a user', () =>
    add.user('Sushi', 'dog')
      .then(result => {
        expect(result).to.be.an('object').with.property('id')
        expect(result).to.have.property('name')
        expect(result).to.have.property('password')

        return get.allUsers()
          .then(users => {
            const sushi = users.filter(user => user.name === 'Sushi')
            return expect(sushi).to.have.lengthOf(1)
          })
      })
  )

  it('deleteUserById deletes a user', () =>
    get.allUsers()
      .then(initialUsers =>
        del.userById(1)
          .then(() =>
            get.allUsers()
              .then(finalUsers => expect(initialUsers.length - 1).to.equal(finalUsers.length))
          )
      )
  )
})
