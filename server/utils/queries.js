const query = {
  /* Users */
  findOwner: () => ({
    text: `SELECT * FROM Users WHERE role = $1`,
    values: ['Owner']
  }),
  regUser: (name, password, role) => ({
    text: `INSERT INTO Users (Name,Password,Role) VALUES ( $1, $2, $3) RETURNING *`,
    values: [name, password, role]
  }),
  findUser: id => ({
    text: `SELECT * FROM Users WHERE UserID = $1`,
    values: [id]
  })
};

export default query;
