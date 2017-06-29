INSERT INTO
  users (name, password, github_id)
VALUES
  ('jason', '$2a$12$OZy/4hQ3OCToszEMenJ2R.B7ltHNCE3HXyTTvpdBfcXh2g64Lkmnq', 20765448),
  ('aaron', '$2a$12$qWx.sIc90OMTYc6YPTpFhelAitKXN6VSkBJozafrzSKSDVUbhPb3u', null);

INSERT INTO
  to_dos (task, user_id)
VALUES
  ('create todolist', 1),
  ('make authentication', 2),
  ('create tests', 2);
