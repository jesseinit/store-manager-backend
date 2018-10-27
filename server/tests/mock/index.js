const invalidProductEntry = {
  imgUrl: 1027,
  name: '',
  category: '',
  price: '',
  qty: 0
};

const validProductEntry = {
  imgUrl: 'https://example.com/tv.jpg',
  name: '32inch LED Television',
  category: 'Electronics',
  price: 78900,
  qty: 5
};

const validLogin = {
  userid: 1,
  password: 'owner'
};

const invalidLogin = {
  userid: 0,
  password: 'owner'
};

const nonExistingLogin = {
  userid: 10,
  password: 'owner'
};

const failedLogin = {
  userid: 1,
  password: 'wrongpassword'
};

export default {
  validLogin,
  invalidLogin,
  nonExistingLogin,
  failedLogin,
  invalidProductEntry,
  validProductEntry
};
