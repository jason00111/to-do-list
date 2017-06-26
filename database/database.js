const pgp = require('pg-promise')()({ database: 'to_do' })

const getToDoById = id =>
  pgp.any('SELECT * FROM to_dos WHERE id = $1', id).then(results => results[0])

const getToDosByUserId = user_id =>
  pgp.any('SELECT * FROM to_dos WHERE user_id = $1', user_id)

const addToDo = (task, user_id) =>
  pgp.none('INSERT INTO to_dos (task, user_id) VALUES ($1, $2)', [task, user_id])

const deleteToDoById = id =>
  pgp.none('DELETE FROM to_dos WHERE id = $1', id)

const completeToDoById = id =>
  pgp.none('UPDATE to_dos SET completed = true WHERE id = $1', id)

const uncompleteToDoById = id =>
  pgp.none('UPDATE to_dos SET completed = false WHERE id = $1', id)

const editToDoById = (id, task) =>
  pgp.none('UPDATE to_dos SET task = $2 WHERE id = $1', [id, task])

module.exports = {
  getToDosByUserId,
  addToDo,
  deleteToDoById,
  completeToDoById,
  uncompleteToDoById,
  editToDoById,
  getToDoById
}
