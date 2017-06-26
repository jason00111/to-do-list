const { expect } = require('chai')
const { getToDosByUserId, addToDo, deleteToDoById } = require('./database.js')

describe('database', () => {
  it('getToDosByUserId gets tasks by user id', () =>
    getToDosByUserId(1)
    .then(results =>
      expect(results).to.be.an('array').with.lengthOf(1)
    )
  )

  it('addToDo adds a to-do', () =>
    addToDo('buy bread', 1)
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
      const task = results.filter(result => result.task === 'buy bread')
      expect(task).to.be.an('array').with.lengthOf(1)
      return deleteToDoById(task[0].id)
      .then(() =>
        getToDosByUserId(1)
        .then(results => {
          const task = results.filter(result => result.task === 'buy bread')
          return expect(task).to.be.an('array').with.lengthOf(0)
        })
      )
    })
  )
})
