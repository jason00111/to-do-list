const pgp = require('pg-promise')()({ database: 'to_do' })

const getToDoById = id =>
  pgp.any('SELECT * FROM to_dos WHERE id = $1', id).then(results => results[0])

const getToDosByUserId = user_id =>
  pgp.any('SELECT * FROM to_dos WHERE user_id = $1', user_id)

const addToDo = (user_id, task) =>
  pgp.none('INSERT INTO to_dos (task, user_id) VALUES ($1, $2)', [task, user_id])

const deleteToDoById = id =>
  pgp.none('DELETE FROM to_dos WHERE id = $1', id)

const toggleCompletenessById = id =>
  pgp.none('UPDATE to_dos SET completed = NOT completed WHERE id = $1', id)

const editToDoById = (id, task) =>
  pgp.none('UPDATE to_dos SET task = $2 WHERE id = $1', [id, task])

const getAllUsers = () =>
  pgp.any('SELECT * FROM users')

const getUserById = id =>
  pgp.one('SELECT * FROM users WHERE id = $1', id)

const addUser = (name, password) =>
  pgp.one(
    'INSERT INTO users (name, password) VALUES ($1, $2) RETURNING *',
    [name, password]
  )

const deleteToDosByUserId = user_id =>
  pgp.none('DELETE FROM to_dos WHERE user_id = $1', user_id)

const deleteUserById = id =>
  deleteToDosByUserId(id)
  .then(() =>
    pgp.none('DELETE FROM users WHERE id = $1', id)
  )

const getUserByGithubId = githubId =>
  pgp.one('SELECT * FROM users WHERE github_id = $1', githubId)

module.exports = {
  getToDosByUserId,
  addToDo,
  deleteToDoById,
  editToDoById,
  getToDoById,
  getAllUsers,
  addUser,
  deleteUserById,
  toggleCompletenessById,
  getUserById,
  getUserByGithubId
}
