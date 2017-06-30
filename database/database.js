const pgp = require('pg-promise')()({ database: 'to_do' })

const getAllInfoFrom = (table, selector, one) =>
  id => {
    const query = `SELECT * FROM ${table}` +
      (selector ? ` WHERE ${selector} = $1` : '')

    return (one ? pgp.one : pgp.any)(query, id)
  }

const deleteFrom = (table, selector) =>
  id => pgp.none(`DELETE FROM ${table} WHERE ${selector} = $1`, id)


const getToDoById = getAllInfoFrom('to_dos', 'id', true)

const getToDosByUserId = getAllInfoFrom('to_dos', 'user_id')

const getAllUsers = getAllInfoFrom('users')

const getUserById = getAllInfoFrom('users', 'id', true)

const getUserByGithubId = getAllInfoFrom('users', 'github_id')


const deleteToDoById = deleteFrom('to_dos', 'id')

const deleteToDosByUserId = deleteFrom('to_dos', 'user_id')

const deleteUserById = id =>
  deleteToDosByUserId(id)
  .then(() => deleteFrom('users', 'id')(id))

const updateInfo = (selector, condition ) =>
  (id, task) =>
    pgp.none(
      `UPDATE to_dos SET ${selector} = ${condition} WHERE id = $1`,
      task ? [id, task] : id
    )

const toggleCompletenessById = updateInfo('completed', 'NOT completed')

const editToDoById = updateInfo('task', '$2')


const addToDo = (user_id, task) =>
pgp.none('INSERT INTO to_dos (task, user_id) VALUES ($1, $2)', [task, user_id])

const addUser = (name, password) =>
  pgp.one(
    'INSERT INTO users (name, password) VALUES ($1, $2) RETURNING *',
    [name, password]
  )

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
