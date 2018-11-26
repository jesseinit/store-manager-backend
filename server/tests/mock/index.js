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

const login = {
  ownerLogin: {
    email: 'owner@storemanager.com',
    password: 'owner'
  },
  attendantLogin: {
    email: 'attendant@storemanager.com',
    password: 'inflames'
  },
  adminLogin: {
    email: 'admin@storemanager.com',
    password: 'inflames'
  },
  invalidLogin: {
    email: 'blah@wrongdomain.com',
    password: 'sad'
  },
  nonExistingLogin: {
    email: 'blah@storemanager.com',
    password: 'inflames'
  },
  failedLogin: {
    email: 'owner@storemanager.com',
    password: 'wrongPassword'
  }
};

const signUp = {
  invalidNewUser: {
    name: 'Big Man',
    email: 'blah@wrongdomain.com',
    password: 'bad',
    role: 'Unsupported Role Type'
  },
  validNewAttendant: {
    name: 'Attendant',
    email: 'attendant@storemanager.com',
    password: 'inflames',
    role: 'Attendant'
  },
  validNewAdmin: {
    name: 'Admin',
    email: 'admin@storemanager.com',
    password: 'inflames',
    role: 'Admin'
  }
};

const modifyUser = {
  validUpdateInfo: {
    name: 'Updated Attendant',
    password: 'inflames',
    role: 'Attendant'
  }
};

const category = {
  validCategoryName: {
    name: 'Electronics'
  },
  existingCategoryName: {
    name: 'Electronics'
  },
  invalidCategoryName: {
    name: 'E'
  },
  validUpdateName: {
    name: 'Mobile Phones'
  }
};

const products = {
  invalidProductInfo: {
    imgUrl: 'http://example.com/photo.jpg',
    name: 'Router',
    categoryid: 0,
    price: 0,
    qty: 0
  },
  validProductInfo: {
    imgUrl: 'http://example.com/photo.jpg',
    name: 'Router',
    categoryid: 1,
    price: 10.01,
    qty: 10
  },
  validProductInfoForSale: {
    imgUrl: 'http://example.com/photo.jpg',
    name: 'Router 2',
    categoryid: 1,
    price: 10.01,
    qty: 10
  },
  validProductUpdateInfo: {
    imgUrl: 'http://example.com/photo.jpg',
    name: 'RJ 45 Plugs',
    categoryid: 1,
    price: 10.01,
    qty: 10
  },
  NonExistingCategoryIdProductUpdateInfo: {
    categoryid: 10
  },
  NonExistingCategoryId: {
    imgUrl: 'http://example.com/photo.jpg',
    name: 'Router',
    categoryid: 10,
    price: 10,
    qty: 10
  }
};

const newSale = {
  valid: {
    products: [{ id: 3, qty: 1 }]
  },
  nonexisting: {
    products: [{ id: 10, qty: 1 }]
  }
};

export default {
  login,
  signUp,
  modifyUser,
  category,
  products,
  newSale,
  invalidProductEntry,
  validProductEntry
};
