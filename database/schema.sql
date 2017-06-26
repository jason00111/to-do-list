DROP TABLE IF EXISTS to_do;

CREATE TABLE to_do (
  id SERIAL PRIMARY KEY,
  task TEXT,
  completed BOOLEAN DEFAULT false
)
