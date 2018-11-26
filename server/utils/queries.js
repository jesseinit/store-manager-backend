const query = {
  /* Users */
  findUserByEmail: email => ({
    text: `SELECT * FROM users WHERE email = $1`,
    values: [email]
  }),

  findUserById: userid => ({
    text: `SELECT * FROM users WHERE id = $1`,
    values: [userid]
  }),

  regUser: (name, email, password, role) => ({
    text: `INSERT INTO users (name,email,password,role) VALUES ($1, $2, $3, $4) RETURNING *`,
    values: [name, email, password, role]
  }),

  getAllUsers: () => `Select id,name,email,role FROM users ORDER BY id`,

  updateUser: (name, password, role, userid) => ({
    text: `UPDATE users SET 
          name = COALESCE($1,name), password = COALESCE($2,password), 
          role = COALESCE($3,role), email = COALESCE(email) 
          WHERE id = $4 RETURNING *`,
    values: [name, password, role, userid]
  }),

  deleteUser: id => ({
    text: `DELETE FROM users WHERE id = $1`,
    values: [id]
  }),

  /* Categories */
  findCategoryByName: name => ({
    text: `SELECT * FROM category WHERE category_name = $1`,
    values: [name]
  }),

  findCategoryById: id => ({
    text: `SELECT * FROM category WHERE category_id = $1`,
    values: [id]
  }),

  getAllCategories: () => `SELECT * from category ORDER BY category_id`,

  createCategory: name => ({
    text: `INSERT INTO category (category_name) VALUES ($1) RETURNING *`,
    values: [name]
  }),

  updateCategory: (id, name) => ({
    text: `UPDATE category SET category_name = $1 WHERE category_id = $2 RETURNING *`,
    values: [name, id]
  }),

  deleteCategory: id => ({
    text: `DELETE FROM category WHERE category_id = $1`,
    values: [id]
  }),

  /* Products */
  getAllProductsCount: () => ({
    text: `SELECT p.*, COALESCE (c.category_name, 'Not Set') as category_name 
          FROM products p LEFT JOIN category c 
          ON c.category_id = p.category_id 
          ORDER BY p.product_id DESC `,
    values: []
  }),

  getAllProducts: (limit, offset) => ({
    text: `SELECT p.*, COALESCE (c.category_name, 'Not Set') as category_name 
          FROM products p LEFT JOIN category c 
          ON c.category_id = p.category_id 
          ORDER BY p.product_id DESC 
          LIMIT $1 OFFSET $2`,
    values: [limit, offset]
  }),

  getAllProductsByCategoryCount: (categoryId, productName) => ({
    text: `SELECT p.*, c.*, COALESCE (c.category_name, 'Not Set') as category_name 
          FROM products p FULL JOIN category c 
          ON c.category_id = p.category_id 
          WHERE c.category_id = $1 AND p.product_name ILIKE $2`,
    values: [categoryId, `%${productName}%`]
  }),

  getAllProductsByCategory: (categoryId, productName, offset) => ({
    text: `SELECT p.*, c.*, COALESCE (c.category_name, 'Not Set') as category_name 
          FROM products p FULL JOIN category c 
          ON c.category_id = p.category_id 
          WHERE c.category_id = $1 AND p.product_name ILIKE $2
          LIMIT 10 OFFSET $3`,
    values: [categoryId, `%${productName}%`, offset]
  }),

  getAllProductsByNameCount: productName => ({
    text: `SELECT p.*, COALESCE (c.category_name, 'Not Set') as category_name 
          FROM products p FULL JOIN category c 
          ON c.category_id = p.category_id 
          WHERE p.product_name ILIKE $1`,
    values: [`%${productName}%`]
  }),

  getAllProductsByName: (productName, offset) => ({
    text: `SELECT p.*, COALESCE (c.category_name, 'Not Set') as category_name 
          FROM products p FULL JOIN category c 
          ON c.category_id = p.category_id 
          WHERE p.product_name ILIKE $1
          LIMIT 10 OFFSET $2`,
    values: [`%${productName}%`, offset]
  }),

  filterAllProductsByStockCount: stock => ({
    text: `SELECT p.*, COALESCE (c.category_name, 'Not Set') as category_name 
          FROM products p FULL JOIN category c 
          ON c.category_id = p.category_id 
          WHERE p.product_qty < $1`,
    values: [stock]
  }),

  filterAllProductsByStock: (stock, offset) => ({
    text: `SELECT p.*, COALESCE (c.category_name, 'Not Set') as category_name 
          FROM products p FULL JOIN category c 
          ON c.category_id = p.category_id 
          WHERE p.product_qty < $1 ORDER BY p.product_qty LIMIT 10 OFFSET $2`,
    values: [stock, offset]
  }),

  getProductById: id => ({
    text: `SELECT p.*, COALESCE (c.category_name, 'Not Set') as category_name 
          FROM products p FULL JOIN category c ON c.category_id = p.category_id 
          WHERE p.product_id = $1`,
    values: [id]
  }),

  createProduct: productsInfo => ({
    text: `INSERT INTO products 
          (product_image,product_name,category_id,product_price,product_qty) 
          VALUES 
          ($1,$2,$3,$4,$5) RETURNING *`,
    values: [
      productsInfo.imgUrl,
      productsInfo.name,
      productsInfo.categoryid,
      Number.parseFloat(productsInfo.price).toFixed(2),
      productsInfo.qty
    ]
  }),

  updateProduct: updateInfo => ({
    text: `UPDATE products SET 
          product_image = COALESCE ($1, product_image), 
          product_name = COALESCE ($2, product_name), 
          category_id = COALESCE($3, category_id), 
          product_price = COALESCE($4, product_price), 
          product_qty = COALESCE($5, product_qty) 
          WHERE product_id = $6 RETURNING *`,
    values: [
      updateInfo.imageUrl,
      updateInfo.name,
      updateInfo.categoryid,
      updateInfo.price,
      updateInfo.qty,
      updateInfo.id
    ]
  }),

  deleteProduct: id => ({
    text: `DELETE FROM products WHERE product_id = $1`,
    values: [id]
  }),

  /* Sales */
  createSale: (userid, totals) => ({
    text: `INSERT INTO sales (user_id, sale_total) VALUES ($1, $2) RETURNING *`,
    values: [userid, totals]
  }),

  createProductSales: (productId, productName, productPrice, saleId, productWorth, productQty) => ({
    text: `INSERT INTO productSales (product_id, product_name, product_price, sale_id, product_worth, product_qty) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    values: [productId, productName, productPrice, saleId, productWorth, productQty]
  }),

  thisSale: saleId => ({
    text: `SELECT * FROM productSales as ps 
          JOIN sales as s ON ps.sale_id = s.sale_id 
          JOIN products as p ON p.product_id = ps.product_id 
          WHERE ps.sale_id = $1`,
    values: [saleId]
  }),

  getAllSalesCount: () => `SELECT * FROM productSales`,

  getAllSales: (limit, offset) => ({
    text: `SELECT ps.sale_id as s_id, ps.sale_date as s_date, ps.product_name as s_description, ps.product_qty as s_qty,
          ps.product_price as s_price, ps.product_worth as s_total, s.user_id as s_user FROM productSales as ps 
          JOIN sales as s ON s.sale_id = ps.sale_id
          LEFT JOIN products as p ON p.product_id = ps.product_id
          ORDER BY ps.sale_id DESC
          LIMIT $1 OFFSET $2`,
    values: [limit, offset]
  }),

  getTotalProductSold: () => `SELECT COALESCE(SUM(ps.product_qty), 0) as total_products_sold FROM productSales as ps`,
  getTotalProductSoldAttendant: userid => ({
    text: `SELECT COALESCE(SUM(ps.product_qty), 0) as total_products_sold FROM productSales as ps 
          JOIN sales as s ON s.sale_id = ps.sale_id WHERE s.user_id = $1`,
    values: [userid]
  }),

  getTotalProdWorth: () => `SELECT COALESCE(SUM(s.sale_total), 0) as total_products_worth FROM sales as s`,
  getTotalProdWorthAttendant: userid => ({
    text: `SELECT COALESCE(SUM(s.sale_total), 0) as total_products_worth FROM sales as s 
          WHERE s.user_id = $1`,
    values: [userid]
  }),

  getTotalSaleOrders: () => `SELECT * FROM sales`,
  getTotalSaleOrdersAttendant: userid => ({ text: `SELECT * FROM sales WHERE user_id = $1`, values: [userid] }),

  getLastFiveSales: () => ({
    text: `SELECT ps.sale_id as s_id, ps.sale_date as s_date, ps.product_name as s_description, ps.product_qty as s_qty,
          ps.product_price as s_price, ps.product_worth as s_total, s.user_id as s_user FROM productSales as ps 
          JOIN sales as s ON s.sale_id = ps.sale_id
          ORDER BY s.sale_id DESC LIMIT 5`
  }),

  getAllSalesByDateCount: (fromDate, endDate) => ({
    text: `SELECT ps.sale_id as s_id, ps.sale_date as s_date, ps.product_name as s_description, ps.product_qty as s_qty,
          ps.product_price as s_price, ps.product_worth as s_total, s.user_id as s_user FROM productSales as ps 
          JOIN sales as s ON s.sale_id = ps.sale_id
          WHERE ps.sale_date BETWEEN $1 AND $2
          ORDER BY ps.sale_id DESC`,
    values: [`'${fromDate}'`, `'${endDate}'`]
  }),

  getAllSalesByDate: (fromDate, endDate, limit, offset) => ({
    text: `SELECT ps.sale_id as s_id, ps.sale_date as s_date, ps.product_name as s_description, ps.product_qty as s_qty,
          ps.product_price as s_price, ps.product_worth as s_total, s.user_id as s_user FROM productSales as ps 
          JOIN sales as s ON s.sale_id = ps.sale_id
          WHERE ps.sale_date BETWEEN $1 AND $2
          ORDER BY ps.sale_id DESC
          LIMIT $3 OFFSET $4`,
    values: [`'${fromDate}'`, `'${endDate}'`, limit, offset]
  }),

  getAllSalesByAttendantCount: userid => ({
    text: `SELECT * FROM productSales as ps 
          JOIN sales as s ON s.sale_id = ps.sale_id
          LEFT JOIN products as p ON p.product_id = ps.product_id
          WHERE s.user_id = $1`,
    values: [userid]
  }),

  getAllSalesByAttendant: (userid, limit, offset) => ({
    text: `SELECT ps.sale_id as s_id, ps.sale_date as s_date, ps.product_name as s_description, ps.product_qty as s_qty,
          ps.product_price as s_price, ps.product_worth as s_total, s.user_id as s_user FROM productSales as ps 
          JOIN sales as s ON s.sale_id = ps.sale_id
          WHERE s.user_id = $1
          ORDER BY s.sale_id DESC
          LIMIT $2 OFFSET $3`,
    values: [userid, limit, offset]
  }),

  getSingleSaleUser: (userId, saleId) => ({
    text: `SELECT ps.sale_id as s_id, ps.sale_date as s_date, ps.product_name as s_description, ps.product_qty as s_qty,
          ps.product_price as s_price, ps.product_worth as s_total, s.user_id as s_user FROM sales as s 
          JOIN productSales as ps ON s.sale_id = ps.sale_id
          WHERE s.user_id = $1 AND ps.sale_id = $2`,
    values: [userId, saleId]
  }),

  getSingleSaleAdmin: saleId => ({
    text: `SELECT ps.sale_id as s_id,ps.sale_date as s_date,ps.product_name as s_description,ps.product_qty as s_qty,
          ps.product_price as s_price,ps.product_worth as s_total,s.user_id as s_user FROM productSales as ps 
          JOIN sales as s ON s.sale_id = ps.sale_id
          WHERE ps.sale_id = $1`,
    values: [saleId]
  })
};

export default query;
