const query = {
  /* Users */
  findUserByEmail: email => ({
    text: `SELECT * FROM users WHERE email = $1`,
    values: [email]
  }),
  findUserById: userid => ({
    text: `SELECT * FROM users WHERE user_id = $1`,
    values: [userid]
  }),
  regUser: (name, email, password, role) => ({
    text: `INSERT INTO users (name,email,password,role) VALUES ($1, $2, $3, $4) RETURNING *`,
    values: [name, email, password, role]
  }),
  getAllUsers: () => `Select * FROM users`,
  updateUser: (name, password, role, userid) => ({
    text: `UPDATE users SET 
          name = COALESCE($1,name), password = COALESCE($2,password), 
          role = COALESCE($3,role), email = COALESCE(email) 
          WHERE user_id = $4 RETURNING *`,
    values: [name, password, role, userid]
  }),
  deleteUser: id => ({
    text: `DELETE FROM users WHERE user_id = $1`,
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
  }),
  deleteCategory: id => ({
    text: `DELETE FROM category WHERE categoryid = $1`,
    values: [id]
  }),
  /* Products */
  getAllProducts: () =>
    `SELECT p.*, COALESCE (c.categoryname, 'Not Set') as categoryname 
    FROM products p JOIN category c 
    ON c.categoryid = p.categoryid`,
  getProductById: id => ({
    text: `SELECT p.*, COALESCE (c.categoryname, 'Not Set') as categoryname 
          FROM products p FULL JOIN category c ON c.categoryid = p.categoryid 
          WHERE p.id = $1`,
    values: [id]
  }),
  createProduct: productsInfo => ({
    text: `INSERT INTO products (imageurl,name,categoryId,price,qty) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    values: [
      productsInfo.imgUrl,
      productsInfo.name,
      productsInfo.categoryid,
      Number.parseFloat(productsInfo.price).toFixed(2),
      productsInfo.qty
    ]
  }),
  updateProduct: (id, updateInfo) => ({
    text: `UPDATE products SET 
          imageurl = COALESCE ($1, imageurl), 
          name = COALESCE ($2, name), 
          categoryid = COALESCE($3, categoryid), 
          price = COALESCE($4, price), 
          qty = COALESCE($5, qty) 
          WHERE id = $6 RETURNING *`,
    values: [
      updateInfo.imgUrl,
      updateInfo.name,
      updateInfo.categoryid,
      Number.parseFloat(updateInfo.price).toFixed(2),
      updateInfo.qty,
      id
    ]
  }),
  deleteProduct: id => ({
    text: `DELETE FROM products WHERE id = $1`,
    values: [id]
  }),
  /* Sales */
  createSale: (userid, totals) => ({
    text: `INSERT INTO sales (user_id, totals) VALUES ($1, $2) RETURNING *`,
    values: [userid, totals]
  }),
  createProductSales: (productId, saleId, productPrice, productQty) => ({
    text: `INSERT INTO productSales (product_id, sale_id, product_price, product_qty) VALUES ($1,$2,$3,$4) RETURNING *`,
    values: [productId, saleId, productPrice, productQty]
  }),
  thisSale: saleId => ({
    text: `SELECT * FROM productSales as ps JOIN sales as s ON ps.sale_id = s.sale_id WHERE ps.sale_id = $1`,
    values: [saleId]
  }),
  getAllSales: () => `SELECT * FROM sales as s join productSales as ps on s.sale_id = ps.sale_id`,
  getSingleSaleUser: (userId, saleId) => ({
    text: `SELECT * FROM sales as s join productSales as ps on s.sale_id = ps.sale_id WHERE s.user_id = $1 AND ps.sale_id = $2`,
    values: [userId, saleId]
  }),
  getSingleSaleAdmin: saleId => ({
    text: `SELECT * FROM sales as s join productSales as ps on s.sale_id = ps.sale_id WHERE ps.sale_id = $1`,
    values: [saleId]
  })
};

export default query;
