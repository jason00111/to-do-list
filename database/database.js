const pgp = require('pg-promise')()({ database: 'to_do' })

const getAllInfoFrom = (table, selector, one) =>
  id => {
    const query = `SELECT * FROM ${table}` +
      (selector ? ` WHERE ${selector} = $1` : '')

    return (one ? pgp.one : pgp.any)(query, id)
  }

const deleteFrom = (table, selector) =>
  id => pgp.none(`DELETE FROM ${table} WHERE ${selector} = $1`, id)

const addInfo = (table, selector1, selector2) =>
  (value1, value2) =>
    pgp.one(`INSERT INTO ${table} (${selector1}, ${selector2}) VALUES ($1, $2) RETURNING *`, [value1, value2])

const updateInfo = (selector, condition ) =>
  (id, task) =>
    pgp.none(
      `UPDATE to_dos SET ${selector} = ${condition} WHERE id = $1`,
      task ? [id, task] : id
    )

const get = {
  toDoById: getAllInfoFrom('to_dos', 'id', true),
  toDosByUserId: getAllInfoFrom('to_dos', 'user_id'),
  allUsers: getAllInfoFrom('users'),
  userById: getAllInfoFrom('users', 'id', true),
  userByGithubId: getAllInfoFrom('users', 'github_id')
}

const del = {
  toDoById: deleteFrom('to_dos', 'id'),
  toDosByUserId: deleteFrom('to_dos', 'user_id'),
  userById: id =>
    del.toDosByUserId(id)
      .then(() => deleteFrom('users', 'id')(id))
}

const add = {
  toDo: addInfo('to_dos', 'user_id', 'task'),
  user: addInfo('users', 'name', 'password')
}

const update = {
  toggleCompletenessById: updateInfo('completed', 'NOT completed'),
  toDoById: updateInfo('task', '$2')
}

module.exports = { get, del, add, update }
