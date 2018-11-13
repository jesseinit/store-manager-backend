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

const successToast = 'toast--success';
const errorToast = 'toast--error';

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
    window.location.replace('/make-sale.html');
  } else {
    window.location.replace('/admin.html');
  }
};

const userEditModal = async e => {
  const userid = Number(e.target.parentElement.getAttribute('data-id'));
  const allUsersEndpoint = `${basepath}/users/?userid=${userid}`;
  const response = await processRequest(allUsersEndpoint);
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
        <h3>Update User</h3>
        <form id="update-user-form" data-id=${id}>
          <input type="text" id="update-name" placeholder="Employee Name" value='${name}' />
          <input id="update-email" disabled value='${email}' />
          <input type="password" id="update-password" placeholder="Password" />
          <select id="update-role">
            ${role}
          </select>
          <input type="submit" value="Update User" />
        </form>
      </div>
    </div>`
  );

  const modal = document.body.querySelector('.modal');
  modal.addEventListener('click', evt => {
    if (evt.target.classList.contains('modal')) document.body.removeChild(modal);
  });

  const updateForm = document.querySelector('#update-user-form');
  updateForm.addEventListener('submit', async ev => {
    ev.preventDefault();
    const uName = document.querySelector('#update-name').value;
    const uEmail = document.querySelector('#update-email').value;
    const uRole = document.querySelector('#update-role').value;
    let uPassword = document.querySelector('#update-password').value;
    uPassword = uPassword.length < 5 ? undefined : document.querySelector('#update-password').value;

    const userUpdateUrl = `${basepath}/users/${ev.target.getAttribute('data-id')}`;
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
    toast(updateResponse.message, errorToast);
    document.body.removeChild(modal);
  });
};

/* const userDeleteModal = async e => {
  document.body.insertAdjacentHTML(
    'afterbegin',
    `<div class="modal">
      <div class="form-body">
        <h3>Do you want to delete User</h3>
        <button id='delete-user'>Yes</button>
        <button id='cancel'>No</button>
      </div>
    </div>`
  );
  const modal = document.body.querySelector('.modal');
  modal.addEventListener('click', evt => {
    if (evt.target.classList.contains('modal')) document.body.removeChild(modal);
  });
  const delUserBtn = document.querySelector('#delete-user');
  const cancelBtn = document.querySelector('#cancel');
  delUserBtn.addEventListener('click', async () => {
    const userid = Number(e.target.parentElement.getAttribute('data-id'));
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
  });

  cancelBtn.addEventListener('click', () => document.body.removeChild(modal));
}; */

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
    editBtn.id = 'edit-user';
    delBtn.id = 'delete-user';
    editBtn.onclick = userEditModal;
    // delBtn.onclick = userDeleteModal;
    append(actions, editBtn);
    append(actions, delBtn);
    append(tr, userId);
    append(tr, userName);
    append(tr, userEmail);
    append(tr, userRole);
    append(tr, actions);
    append(usersTableBody, tr);
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
  toast(response.message, successToast, 5000);
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
  toast(response.message, successToast, 5000);
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
  case '/admin.html':
    break;
  case '/product-settings.html':
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
