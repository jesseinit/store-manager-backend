const _ = undefined;
const basepath = `${window.location.origin}/api/v1`;
const loginForm = document.querySelector('#login-form');
const signupForm = document.querySelector('#signup-form');
const logoutBtn = document.querySelector('#logout-btn');

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

const handleInputErrors = (response, formClass) => {
  const ul = createNode('ul', 'error__container');
  const form = document.querySelector(formClass);
  if (form.children[0].classList.contains('error__container')) {
    form.removeChild(form.children[0]);
  }
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
    window.location.replace('/ui/make-sale.html');
  } else {
    window.location.replace('/ui/admin.html');
  }
};

const populateUsersTable = async () => {
  const usersTableBody = document.querySelector('#users-table tbody');
  while (usersTableBody.firstChild) usersTableBody.removeChild(usersTableBody.firstChild);
  const allUsersEndpoint = `${basepath}/users/`;
  const response = await processRequest(allUsersEndpoint);
  response.data.forEach(user => {
    const tr = document.createElement('tr');
    const userId = createNode('td', '', user.id);
    const userName = createNode('td', '', user.name);
    const userEmail = createNode('td', '', user.email);
    const userRole = createNode('td', '', user.role);
    const actions = document.createElement('td');
    actions.setAttribute('data-id', user.id);
    const editBtn = createNode('button', 'green', 'Edit');
    const delBtn = createNode('button', 'red', 'Delete');
    append(actions, editBtn);
    append(actions, delBtn);
    append(tr, userId);
    append(tr, userName);
    append(tr, userEmail);
    append(tr, userRole);
    append(tr, actions);
    append(usersTableBody, tr);
    // console.log(tr);
  });
};

/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

/* Login */
const login = async e => {
  e.preventDefault();

  const email = document.querySelector('#login-email').value;
  const password = document.querySelector('#login-password').value;

  const loginUrl = `${basepath}/auth/login`;
  const loginInfo = { email, password };

  const response = await processRequest(loginUrl, 'POST', loginInfo);

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

  redirectHandler(role);
};

const signup = async e => {
  e.preventDefault();
  const name = document.querySelector('#staff-name').value;
  const email = document.querySelector('#staff-email').value;
  const password = document.querySelector('#staff-password').value;
  const role = document.querySelector('#staff-role').value;

  const signupUrl = `${basepath}/auth/signup`;
  const signupInfo = { name, email, password, role };

  const response = await processRequest(signupUrl, 'POST', signupInfo);

  if (!response.data) {
    handleInputErrors(response, '#signup-form');
    return;
  }
  /* TODO: Totast Success Message Here */
  signupForm.reset();
  populateUsersTable();
};

if (loginForm) {
  loginForm.addEventListener('submit', login);
}

if (signupForm) {
  signupForm.addEventListener('submit', signup);
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', e => {
    e.preventDefault();
    localStorage.clear();
    window.location.replace('./');
  });
}

switch (window.location.pathname) {
  case '/ui/admin.html':
    break;
  case '/ui/product-settings.html':
    break;
  case '/ui/sale-records.html':
    break;
  case '/ui/staff-accounts.html':
    populateUsersTable();
    break;
  case '/ui/make-sale.html':
    break;
  case '/ui/cart.html':
    break;
  case '/ui/my-sales.html':
    break;
  case '/ui/view-product.html':
    break;
  default:
    break;
}
