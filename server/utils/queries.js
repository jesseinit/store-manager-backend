const query = {
  /* Users */
  findUser: id => ({
    text: `SELECT * FROM users WHERE userId = $1`,
    values: [id]
  }),
  regUser: (name, password, role) => ({
    text: `INSERT INTO users (name,password,role) VALUES ( $1, $2, $3) RETURNING *`,
    values: [name, password, role]
  }),
  getAllUsers: () => `Select * FROM users`,
  updateUser: (name, password, role, userid) => ({
    text: `UPDATE users SET name = $1, password = $2, role = $3 WHERE userid = $4 RETURNING *`,
    values: [name, password, role, userid]
  })
};

export default query;
