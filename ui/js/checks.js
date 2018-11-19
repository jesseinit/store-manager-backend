const checkRole = () => {
  const role = localStorage.getItem('role');
  const allowedValues = ['Owner', 'Admin', 'Attendant'];
  if (allowedValues.includes(role) === false) {
    localStorage.clear();
    window.location.replace('./');
  }
};

const adminOnly = role => {
  if (role === 'Attendant') {
    window.location.replace('/make-sale.html');
  }
};

const attendantOnly = role => {
  if (role !== 'Attendant') {
    window.location.replace('/admin.html');
  }
};
const currentPage = window.location.pathname;
const role = localStorage.getItem('role');
const token = localStorage.getItem('token');

switch (currentPage) {
  case '/':
    if (role && token) {
      adminOnly(role);
      attendantOnly(role);
    } else {
      localStorage.clear();
    }
    break;
  case '/admin.html':
    checkRole();
    adminOnly(role);
    break;
  case '/product-settings.html':
    checkRole();
    adminOnly(role);
    break;
  case '/category-settings.html':
    checkRole();
    adminOnly(role);
    break;
  case '/sale-records.html':
    checkRole();
    adminOnly(role);
    break;
  case '/staff-accounts.html':
    checkRole();
    adminOnly(role);
    break;
  case '/make-sale.html':
    checkRole();
    attendantOnly(role);
    break;
  case '/cart.html':
    checkRole();
    attendantOnly(role);
    break;
  case '/my-sales.html':
    checkRole();
    attendantOnly(role);
    break;
  default:
    break;
}
