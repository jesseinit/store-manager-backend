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
  }
};

export default {
  login,
  signUp,
  invalidProductEntry,
  validProductEntry
};
