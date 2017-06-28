const { expect } = require('chai')
const {
  getToDosByUserId,
  addToDo,
  deleteToDoById,
  completeToDoById,
  uncompleteToDoById,
  editToDoById,
  getToDoById,
  getAllUsers,
  addUser,
  deleteUserById
} = require('./database.js')

describe('database', () => {
  it('getToDosByUserId gets tasks by user id', () =>
    getToDosByUserId(1)
    .then(results =>
      expect(results).to.be.an('array').with.lengthOf(1)
    )
  )

  it('addToDo adds a to-do', () =>
    addToDo(1, 'buy bread')
    .then(() =>
      getToDosByUserId(1)
      .then(results =>
        expect(results.some(
          element => element.task === 'buy bread'
        )).to.be.true
      )
    )
  )

  it('deleteToDoById deletes a to-do', () =>
    getToDosByUserId(1)
    .then(results => {
      const tasks = results.filter(result => result.task === 'buy bread')
      expect(tasks).to.be.an('array').with.lengthOf(1)
      return deleteToDoById(tasks[0].id)
      .then(() =>
        getToDosByUserId(1)
        .then(results => {
          const tasks = results.filter(result => result.task === 'buy bread')
          return expect(tasks).to.be.an('array').with.lengthOf(0)
        })
      )
    })
  )

  it('completeToDoById marks a to-do as complete', () =>
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
  )

  it('editToDoById changes the task text', () =>
    editToDoById(1, 'grow flowers')
    .then(() =>
      getToDoById(1)
      .then(result => expect(result.task).to.equal('grow flowers'))
    )
  )

  it('addUser adds a user', () =>
    addUser('Sushi', 'dog')
    .then(result => {
      expect(result).to.be.a('number')
      return getAllUsers()
      .then(users => {
        const sushi = users.filter(user => user.name === 'Sushi')
        return expect(sushi).to.have.lengthOf(1)
      })
    })
  )

  it('deleteUserById deletes a user', () =>
    getAllUsers()
    .then(initialUsers =>
      deleteUserById(1)
      .then(() =>
        getAllUsers()
        .then(finalUsers => expect(initialUsers.length - 1).to.equal(finalUsers.length))
      )
    )
  )
})
