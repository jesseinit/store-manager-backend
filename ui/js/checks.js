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
    window.location.replace('/ui/make-sale.html');
  }
};

const attendantOnly = role => {
  if (role !== 'Attendant') {
    window.location.replace('/ui/admin.html');
  }
};
const currentPage = window.location.pathname;
const role = localStorage.getItem('role');

switch (currentPage) {
  case '/ui/admin.html':
    checkRole();
    adminOnly(role);
    break;
  case '/ui/product-settings.html':
    checkRole();
    adminOnly(role);
    break;
  case '/ui/sale-records.html':
    checkRole();
    adminOnly(role);
    break;
  case '/ui/staff-accounts.html':
    checkRole();
    adminOnly(role);
    break;
  case '/ui/make-sale.html':
    checkRole();
    attendantOnly(role);
    break;
  case '/ui/cart.html':
    checkRole();
    attendantOnly(role);
    break;
  case '/ui/my-sales.html':
    checkRole();
    attendantOnly(role);
    break;
  case '/ui/view-product.html':
    checkRole();
    attendantOnly(role);
    break;
  default:
    break;
}
