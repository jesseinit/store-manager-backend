const query = {
  /* Users */
  findOwner: () => ({
    text: `SELECT * FROM users WHERE role = $1`,
    values: ['Owner']
  }),
  regUser: (name, password, role) => ({
    text: `INSERT INTO users (name,password,role) VALUES ( $1, $2, $3) RETURNING *`,
    values: [name, password, role]
  }),
  findUser: id => ({
    text: `SELECT * FROM users WHERE userId = $1`,
    values: [id]
  })
};

export default query;
