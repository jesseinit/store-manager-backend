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
  }),
  deleteUser: id => ({
    text: `DELETE FROM users WHERE userId = $1`,
    values: [id]
  }),
  /* Categories */
  findCategory: name => ({
    text: `SELECT * FROM category WHERE categoryname = $1`,
    values: [name]
  }),
  findCategoryById: id => ({
    text: `SELECT * FROM category WHERE categoryid = $1`,
    values: [id]
  }),
  getAllCategories: () => `SELECT DISTINCT categoryid, categoryname from category`,
  createCategory: name => ({
    text: `INSERT INTO category (categoryname) VALUES ($1) RETURNING *`,
    values: [name]
  }),
  updateCategory: (id, name) => ({
    text: `UPDATE category SET categoryname = $1 WHERE categoryid = $2 RETURNING *`,
    values: [name, id]
  })
};

export default query;
