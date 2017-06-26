const pgp = require('pg-promise')()({ database: 'to_do' })

const getToDosByUserId = user_id =>
  pgp.any('SELECT * FROM to_dos WHERE user_id = $1', user_id)

const addToDo = (task, user_id) =>
  pgp.none('INSERT INTO to_dos (task, user_id) VALUES ($1, $2)', [task, user_id])

module.exports = { getToDosByUserId, addToDo }
