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
    userid: 1,
    password: 'owner'
  },
  attendantLogin: {
    userid: 2,
    password: 'awsomeness'
  },
  adminLogin: {
    userid: 3,
    password: 'awsomeness'
  },
  invalidLogin: {
    userid: 0,
    password: 'err'
  },
  nonExistingLogin: {
    userid: 10,
    password: 'owner'
  },
  failedLogin: {
    userid: 1,
    password: 'wrongpassword'
  }
};

const signUp = {
  invalidNewUser: {
    name: 'Big Man',
    password: 'bad',
    role: 'Unsupported Role Type'
  },
  validNewUser: {
    name: 'Big Man',
    password: 'awsomeness',
    role: 'Attendant'
  },
  validNewAdmin: {
    name: 'Big Man',
    password: 'awsomeness',
    role: 'Admin'
  }
};

const modifyUser = {
  validUpdateInfo: {
    name: 'Updated Attendant',
    password: 'awsomeness',
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
  NonExistingCategoryId: {
    imgUrl: 'http://example.com/photo.jpg',
    name: 'Router',
    categoryid: 10,
    price: 10,
    qty: 10
  }
};

export default {
  login,
  signUp,
  modifyUser,
  category,
  products,
  invalidProductEntry,
  validProductEntry
};
