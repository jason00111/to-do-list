const pgp = require('pg-promise')()({ database: 'to_do' })

const getToDosByUserId = user_id =>
  pgp.any('SELECT * FROM to_dos WHERE user_id = $1', user_id)

const addToDo = (task, user_id) =>
  pgp.none('INSERT INTO to_dos (task, user_id) VALUES ($1, $2)', [task, user_id])

const deleteToDoById = id =>
  pgp.none('DELETE FROM to_dos WHERE id = $1', id)

const completeToDoById = id =>
  pgp.none('UPDATE to_dos SET completed = true WHERE id = $1', id)

module.exports = { getToDosByUserId, addToDo, deleteToDoById, completeToDoById }
