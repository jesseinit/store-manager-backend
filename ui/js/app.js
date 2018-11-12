const _ = undefined;
const basepath = `${window.location.origin}/api/v1`;
const loginForm = document.querySelector('#login-form');
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

if (loginForm) {
  loginForm.addEventListener('submit', login);
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', e => {
    e.preventDefault();
    localStorage.clear();
    window.location.replace('./');
  });
}
