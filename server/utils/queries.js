const query = {
  /* Users */
  findUser: id => ({
    text: `SELECT * FROM users WHERE userId = $1`,
    values: [id]
  }),
  regUser: (name, password, role) => ({
    text: `INSERT INTO users (name,password,role) VALUES ( $1, $2, $3) RETURNING *`,
    values: [name, password, role]
  })
};

export default query;
