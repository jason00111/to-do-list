const { expect } = require('chai')
const { getToDosByUserId, addToDo } = require('./database.js')

describe('database', () => {
  it('getToDosByUserId gets tasks by user id', () =>
    getToDosByUserId(1)
    .then(results =>
      expect(results).to.be.an('array').with.lengthOf(1)
    )
  )

  it('addToDo adds a task', () =>
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
})
