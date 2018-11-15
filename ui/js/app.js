const _ = undefined;
const basepath = `${window.location.origin}/api/v1`;
const successToast = 'toast--success';
const errorToast = 'toast--error';
const loginForm = document.querySelector('#login-form');
const createUserForm = document.querySelector('#create-user-form');
const createCategoryForm = document.querySelector('#create-category');
const createProductForm = document.querySelector('#create-new-product');
const logoutBtn = document.querySelector('#logout-btn');
const usersTableBody = document.querySelector('#users-table tbody');
const categoryTableBody = document.querySelector('#category-table tbody');
const productsTableBody = document.querySelector('#products-table tbody');
const recordSort = document.querySelector('.sort');
const filterRowsForm = document.querySelector('#filter-rows');
const filterQtyForm = document.querySelector('#filter-qty');
const clearFiltersProd = document.querySelector('#clear-product-filters');
const filterNameForm = document.querySelector('#filter-name');
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

const processRequest = (url, method = 'GET', body = _) => {
  const token = localStorage.getItem('token');
  const options = {
    method,
    mode: 'cors',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
  };

  return fetch(url, options)
    .then(async res => (res.ok ? res.json() : Promise.reject(await res.json())))
    .then(response => response)
    .catch(e => {
      const { message, error } = e;
      if (message === 'JsonWebTokenError') {
        localStorage.clear();
        window.location.replace('./');
      }
      return { message, error };
    });
};

const createNode = (element, className, content) => {
  const el = document.createElement(element);
  el.className = className;
  el.textContent = content;
  return el;
};

const append = (parent, el) => parent.appendChild(el);

const toast = (msg, className, delay = 4000) => {
  const errorParagraph = createNode('p', '', msg);
  const toastParent = createNode('div', 'toast');
  toastParent.appendChild(errorParagraph);
  toastParent.classList.add(className);
  const body = document.querySelector('body');
  body.insertBefore(toastParent, body.children[0]);
  setTimeout(() => {
    body.removeChild(toastParent);
  }, delay);
};

const formatCurrency = number =>
  new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 2 }).format(number);

const populateAdminDashboard = async () => {
  const totalProducts = document.querySelector('#total-products');
  const totalCategory = document.querySelector('#total-categories');
  const totalStaff = document.querySelector('#total-staff');
  const miscUrl = `${basepath}/sales/?misc=true`;
  const response = await processRequest(miscUrl);
  const { totalproducts, totalcategory, totalemployee } = response.misc;
  totalProducts.textContent = totalproducts;
  totalCategory.textContent = totalcategory;
  totalStaff.textContent = totalemployee;
};

const destroyInputErrors = formClass => {
  const form = document.querySelector(formClass);
  if (form.children[0].classList.contains('error__container')) {
    form.removeChild(form.children[0]);
  }
};

const destroyModal = e => {
  if (e.target.classList.contains('modal')) document.body.removeChild(e.target);
};

const handleInputErrors = (response, formClass) => {
  const ul = createNode('ul', 'error__container');
  const form = document.querySelector(formClass);
  destroyInputErrors(formClass);
  if (response.message) {
    const li = createNode('li', _, response.message);
    append(ul, li);
    form.insertBefore(ul, form.children[0]);
  } else {
    response.error.forEach(msg => {
      const li = createNode('li', _, msg);
      append(ul, li);
      form.insertBefore(ul, form.children[0]);
    });
  }
};

const redirectHandler = role => {
  if (role === 'Attendant') {
    window.location.replace('/make-sale.html');
  } else {
    window.location.replace('/admin.html');
  }
};

/* User Settings */
const populateUserEditModal = response => {
  const { id, name, email } = response.data;
  let { role } = response.data;
  if (role === 'Owner') {
    role = `<option selected value="Owner">Owner</option>`;
  } else if (role === 'Admin') {
    role = `<option value="Attendant">Attendant</option> <option selected value="Admin">Admin</option>`;
  } else {
    role = `<option selected value="Attendant">Attendant</option> <option value="Admin">Admin</option>`;
  }
  document.body.insertAdjacentHTML(
    'afterbegin',
    `<div class="modal">
      <div class="form-body">
        <h3>Update User</h3><form id="update-user-form" data-id=${id}>
          <input type="text" id="update-name" placeholder="Employee Name" value='${name}'/>
          <input id="update-email" disabled value='${email}'/>
          <input type="password" id="update-password" placeholder="Password" />
          <select id="update-role">${role}</select>
          <input type="submit" value="Update User" /></form>
      </div>
    </div>`
  );
};

const updateUser = async e => {
  e.preventDefault();

  const modal = document.body.querySelector('.modal');
  const uName = document.querySelector('#update-name').value;
  const uEmail = document.querySelector('#update-email').value;
  const uRole = document.querySelector('#update-role').value;
  let uPassword = document.querySelector('#update-password').value;
  uPassword = uPassword.length < 5 ? undefined : document.querySelector('#update-password').value;

  const userUpdateUrl = `${basepath}/users/${e.target.getAttribute('data-id')}`;
  const updateInfo = { name: uName, email: uEmail, password: uPassword, role: uRole };

  if (!uPassword) delete updateInfo.password;
  if (uRole === 'Owner') delete updateInfo.role;

  const updateResponse = await processRequest(userUpdateUrl, 'PUT', updateInfo);

  if (updateResponse.status === 'success') {
    toast(updateResponse.message, successToast);
    document.body.removeChild(modal);
    populateUsersTable();
    return;
  }

  toast(updateResponse.message || updateResponse.error[0], errorToast);
  document.body.removeChild(modal);
};

const deleteUser = async e => {
  const modal = document.body.querySelector('.modal');
  const userid = Number(e.target.getAttribute('data-id'));
  const deleteUsersEndpoint = `${basepath}/users/${userid}`;
  const deleteResponse = await processRequest(deleteUsersEndpoint, 'DELETE');

  if (!deleteResponse.status) {
    toast(deleteResponse.message, errorToast);
    document.body.removeChild(modal);
    return;
  }

  toast(deleteResponse.message, successToast);
  document.body.removeChild(modal);
  populateUsersTable();
};

const userEditModal = async e => {
  const allUsersEndpoint = `${basepath}/users/?userid=${e.target.parentElement.getAttribute('data-id')}`;
  const response = await processRequest(allUsersEndpoint);
  populateUserEditModal(response);
  const modal = document.body.querySelector('.modal');
  modal.addEventListener('click', destroyModal);
  const updateForm = document.querySelector('#update-user-form');
  updateForm.addEventListener('submit', updateUser);
};

const userDeleteModal = async e => {
  document.body.insertAdjacentHTML(
    'afterbegin',
    `<div class="modal">
      <div class="form-body">
        <h3>Do you want to delete user?</h3>
        <button data-id=${e.target.parentElement.getAttribute('data-id')} id='confirm-delete'>Yes</button>
        <button id='cancel'>No</button>
      </div>
    </div>`
  );

  const modal = document.body.querySelector('.modal');
  modal.addEventListener('click', destroyModal);

  const delUserBtn = document.querySelector('#confirm-delete');
  const cancelBtn = document.querySelector('#cancel');

  delUserBtn.addEventListener('click', deleteUser);
  cancelBtn.addEventListener('click', () => document.body.removeChild(modal));
};

const populateUsersTable = async () => {
  while (usersTableBody.firstChild) usersTableBody.removeChild(usersTableBody.firstChild);
  const response = await processRequest(`${basepath}/users/`);
  response.data.forEach(user => {
    usersTableBody.insertAdjacentHTML(
      'beforeend',
      `<tr>
          <td>${user.id}</td>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.role}</td>
          <td data-id=${user.id} style="text-align: center">
            <button class="blue">Edit</button>
            <button class="red">Delete</button>
          </td>
      </tr>`
    );
    const editBtn = usersTableBody.querySelectorAll('button.blue');
    editBtn.forEach(btn => btn.addEventListener('click', userEditModal));
    const delBtn = usersTableBody.querySelectorAll('button.red');
    delBtn.forEach(btn => btn.addEventListener('click', userDeleteModal));
  });
  toast(response.message, successToast, 1000);
};

/* Category Settings */
const populateCategoryModal = response => {
  if (!response.data) {
    toast(response.message, errorToast);
    return;
  }
  const id = response.data.category_id;
  const name = response.data.category_name;
  document.body.insertAdjacentHTML(
    'afterbegin',
    `<div class="modal">
      <div class="form-body">
        <h3>Update Category</h3><form id="update-category-form" data-id=${id}>
          <input type="text" id="update-name" placeholder="Category Name" value='${name}'/>
          <input type="submit" value="Update Category" /></form>
      </div>
    </div>`
  );
};

const updateCategory = async e => {
  e.preventDefault();

  const modal = document.body.querySelector('.modal');
  const uName = document.querySelector('#update-name').value;

  const categoryUpdateUrl = `${basepath}/category/${e.target.getAttribute('data-id')}`;
  const updateInfo = { name: uName };

  const updateResponse = await processRequest(categoryUpdateUrl, 'PUT', updateInfo);

  if (updateResponse.status === 'success') {
    toast(updateResponse.message, successToast);
    document.body.removeChild(modal);
    populateCategoryTable();
    return;
  }

  toast(updateResponse.message || updateResponse.error[0], errorToast);
};

const deleteCategory = async e => {
  const modal = document.body.querySelector('.modal');
  const categoryId = Number(e.target.getAttribute('data-id'));
  const deleteCategoryUrl = `${basepath}/category/${categoryId}`;
  const deleteResponse = await processRequest(deleteCategoryUrl, 'DELETE');

  if (!deleteResponse.status) {
    toast(deleteResponse.message, errorToast);
    document.body.removeChild(modal);
    return;
  }

  toast('Category deleted successfully', successToast);
  document.body.removeChild(modal);
  populateCategoryTable();
};

const categoryDeleteModal = async e => {
  document.body.insertAdjacentHTML(
    'afterbegin',
    `<div class="modal">
      <div class="form-body">
        <h3>Do you want to delete this category?</h3>
        <button data-id=${e.target.parentElement.getAttribute('data-id')} id='confirm-delete'>Yes</button>
        <button id='cancel'>No</button>
      </div>
    </div>`
  );

  const modal = document.body.querySelector('.modal');
  modal.addEventListener('click', destroyModal);

  const delUserBtn = document.querySelector('#confirm-delete');
  const cancelBtn = document.querySelector('#cancel');

  delUserBtn.addEventListener('click', deleteCategory);
  cancelBtn.addEventListener('click', () => document.body.removeChild(modal));
};

const categoryEditModal = async e => {
  const singleCategoryUrl = `${basepath}/category/${e.target.parentElement.getAttribute('data-id')}`;
  const response = await processRequest(singleCategoryUrl);

  populateCategoryModal(response);
  const modal = document.body.querySelector('.modal');
  modal.addEventListener('click', destroyModal);
  const updateForm = document.querySelector('#update-category-form');
  updateForm.addEventListener('submit', updateCategory);
};

const populateCategoryTable = async () => {
  const response = await processRequest(`${basepath}/category/`);
  while (categoryTableBody.firstChild) categoryTableBody.removeChild(categoryTableBody.firstChild);
  if (!response.data.length) {
    categoryTableBody.insertAdjacentHTML(
      'beforeend',
      `<tr><td colspan=3>You have not created a category yet. 😕</td></tr>`
    );
    return;
  }
  response.data.forEach(category => {
    categoryTableBody.insertAdjacentHTML(
      'beforeend',
      `<tr><td>${category.category_id}</td><td>${category.category_name}</td>
          <td data-id=${category.category_id} style="text-align: center">
          <button class="blue">Edit</button><button class="red">Delete</button>
        </td>
      </tr>`
    );
    const editBtn = categoryTableBody.querySelectorAll('button.blue');
    editBtn.forEach(btn => btn.addEventListener('click', categoryEditModal));
    const delBtn = categoryTableBody.querySelectorAll('button.red');
    delBtn.forEach(btn => btn.addEventListener('click', categoryDeleteModal));
  });
  toast(response.message, successToast, 1000);
};

const populateCategoryDropDown = async () => {
  const categoryDropDown = document.querySelector('#product-cat');
  const response = await processRequest(`${basepath}/category/`);
  response.data.forEach(category => {
    categoryDropDown.insertAdjacentHTML(
      'beforeend',
      `<option value=${category.category_id}>${category.category_name}</option>`
    );
  });
};

const goToPage = async (tbodyElement, page, limit = 10, query = _) => {
  const queryString = `${basepath}/products/?page=${page}&limit=${limit}&${query}`;
  const paginationResponse = await processRequest(queryString);
  while (tbodyElement.firstChild) tbodyElement.removeChild(tbodyElement.firstChild);
  paginationResponse.data.forEach(product => {
    generateTableBodyEntries(tbodyElement, product);
  });
  paginationComponent(tbodyElement, paginationResponse, limit, query);
};

const paginationComponent = (tbodyElement, response, limit, query) => {
  const paginationEl = document.querySelector('.pagination');
  if (paginationEl) {
    paginationEl.remove();
  }
  const { hasPrevPage, hasNextPage, nextPage, prevPage } = response.meta;
  const prev = hasPrevPage
    ? `<button class="pagination__prev">⬅ Previous Page</button>`
    : `<button disabled class="pagination__prev">⬅ Previous Page</button>`;
  const next = hasNextPage
    ? `<button class="pagination__next">Next Page ➡</button>`
    : `<button disabled class="pagination__next">Next Page ➡</button>`;
  tbodyElement.parentElement.parentElement.insertAdjacentHTML(
    'beforeend',
    `<section class="pagination">${prev}${next}</section>`
  );
  const nextPageBtn = document.querySelector('.pagination__next');
  const prevPageBtn = document.querySelector('.pagination__prev');
  nextPageBtn.addEventListener('click', () => goToPage(tbodyElement, nextPage, limit, query));
  prevPageBtn.addEventListener('click', async () => goToPage(tbodyElement, prevPage, limit, query));
};

/* Products Settings */
const generateTableBodyEntries = (element, entity) => {
  element.insertAdjacentHTML(
    'beforeend',
    `<tr>
      <td>${entity.product_id}</td>
      <td>${entity.product_name}</td>
      <td>N ${formatCurrency(entity.product_price)}</td>
      <td>${entity.product_qty}</td>
      <td data-id=${entity.product_id} style="text-align: center">
        <button class="blue">Edit</button><button class="red">Delete</button>
      </td>
    </tr>`
  );
};

const populateProductsTable = async () => {
  const response = await processRequest(`${basepath}/products/`);
  while (productsTableBody.firstChild) productsTableBody.removeChild(productsTableBody.firstChild);
  if (!response.data.length) {
    productsTableBody.insertAdjacentHTML('beforeend', `<tr><td colspan=5>${response.message}</td></tr>`);
    return;
  }
  recordSort.style.display = 'block';
  response.data.forEach(product => {
    generateTableBodyEntries(productsTableBody, product);
  });
  paginationComponent(productsTableBody, response);
  toast(response.message, successToast, 1000);
};

/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

const login = async e => {
  e.preventDefault();
  const email = document.querySelector('#login-email').value;
  const password = document.querySelector('#login-password').value;
  const loginUrl = `${basepath}/auth/login`;
  const loginInfo = { email, password };
  const response = await processRequest(loginUrl, 'POST', loginInfo);
  destroyInputErrors('.form__login');
  if (!response.data) {
    if (response.message) {
      handleInputErrors(response, '.form__login');
      return;
    }
    handleInputErrors(response, '.form__login');
    return;
  }
  const { token, role } = response.data;
  localStorage.setItem('token', token);
  localStorage.setItem('role', role);
  toast(response.message, successToast, 5000);
  redirectHandler(role);
};

const createUser = async e => {
  e.preventDefault();
  const name = document.querySelector('#staff-name').value;
  const email = document.querySelector('#staff-email').value;
  const password = document.querySelector('#staff-password').value;
  const role = document.querySelector('#staff-role').value;
  const signupUrl = `${basepath}/auth/signup`;
  const signupInfo = { name, email, password, role };
  const response = await processRequest(signupUrl, 'POST', signupInfo);
  destroyInputErrors('#create-user-form');
  if (!response.data) {
    handleInputErrors(response, '#create-user-form');
    return;
  }
  toast(response.message, successToast, 5000);
  createUserForm.reset();
  populateUsersTable();
};

const createCategory = async e => {
  e.preventDefault();
  const categoryName = document.querySelector('#category-name').value;
  const categoryEnpoint = `${basepath}/category`;
  const categoryInfo = { name: categoryName };
  const response = await processRequest(categoryEnpoint, 'POST', categoryInfo);
  destroyInputErrors('#create-category');
  if (!response.data) {
    toast(response.message, errorToast);
    return;
  }
  createCategoryForm.reset();
  toast(response.message, successToast);
  populateCategoryTable();
};

const createProduct = async e => {
  e.preventDefault();
  const imgUrl = document.querySelector('#product-imgurl').value;
  const name = document.querySelector('#product-name').value;
  const price = document.querySelector('#product-price').value;
  const qty = document.querySelector('#product-qty').value;
  const categoryid = document.querySelector('#product-cat').value;
  if (!Number(categoryid)) {
    toast('Please select a category', errorToast, 5000);
    return;
  }
  const productInfo = { imgUrl, name, categoryid, price, qty };
  const productUrl = `${basepath}/products`;
  const response = await processRequest(productUrl, 'POST', productInfo);
  if (!response.data) {
    handleInputErrors(response, '#create-new-product');
    return;
  }
  destroyInputErrors('#create-new-product');
  createProductForm.reset();
  toast(response.message, successToast);
  populateProductsTable();
};

const filterByRows = async e => {
  e.preventDefault();
  const limit = document.querySelector('#filter-pref').value;
  const filterQuery = `${basepath}/products/?limit=${limit}`;
  const response = await processRequest(filterQuery);
  while (productsTableBody.firstChild) productsTableBody.removeChild(productsTableBody.firstChild);
  response.data.forEach(product => generateTableBodyEntries(productsTableBody, product));
  paginationComponent(productsTableBody, response, limit);
  toast(response.message, successToast, 1000);
};

const filterByName = async e => {
  e.preventDefault();

  const searchText = document.querySelector('#search-name').value;

  const filterQuery = `${basepath}/products/?search=${searchText}`;
  const response = await processRequest(filterQuery);
  while (productsTableBody.firstChild) productsTableBody.removeChild(productsTableBody.firstChild);
  response.data.forEach(product => generateTableBodyEntries(productsTableBody, product));
  paginationComponent(productsTableBody, response, 10);
  toast(response.message, successToast, 1000);
};

const filterByQty = async e => {
  e.preventDefault();
  const qty = document.querySelector('#qty-pref').value;
  const filterQuery = `${basepath}/products/?stock=${qty}`;
  const response = await processRequest(filterQuery);
  while (productsTableBody.firstChild) productsTableBody.removeChild(productsTableBody.firstChild);
  response.data.forEach(product => generateTableBodyEntries(productsTableBody, product));
  paginationComponent(productsTableBody, response, 10, `stock=${qty}`);
  toast(response.message, successToast, 1000);
};

const clearProductFilers = () => {
  toast('Filters cleared', successToast, 1000);
  filterRowsForm.reset();
  filterQtyForm.reset();
  filterNameForm.reset();
  populateProductsTable();
};

if (loginForm) loginForm.addEventListener('submit', login);

if (createUserForm) createUserForm.addEventListener('submit', createUser);

if (createCategoryForm) createCategoryForm.addEventListener('submit', createCategory);

if (createProductForm) createProductForm.addEventListener('submit', createProduct);

if (filterRowsForm) filterRowsForm.addEventListener('submit', filterByRows);
if (filterQtyForm) filterQtyForm.addEventListener('submit', filterByQty);
if (clearFiltersProd) clearFiltersProd.addEventListener('click', clearProductFilers);
if (filterNameForm) filterNameForm.addEventListener('submit', filterByName);

if (logoutBtn) {
  logoutBtn.addEventListener('click', e => {
    e.preventDefault();
    localStorage.clear();
    window.location.replace('./');
  });
}

switch (window.location.pathname) {
  case '/admin.html':
    populateAdminDashboard();
    break;
  case '/product-settings.html':
    populateCategoryDropDown();
    populateProductsTable();
    break;
  case '/category-settings.html':
    populateCategoryTable();
    break;
  case '/sale-records.html':
    break;
  case '/staff-accounts.html':
    populateUsersTable();
    break;
  case '/make-sale.html':
    break;
  case '/cart.html':
    break;
  case '/my-sales.html':
    break;
  case '/view-product.html':
    break;
  default:
    break;
}
