DROP TABLE IF EXISTS to_dos;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT,
  password TEXT
);

CREATE TABLE to_dos (
  id SERIAL PRIMARY KEY,
  task TEXT,
  completed BOOLEAN DEFAULT false,
  user_id INT REFERENCES users
);
