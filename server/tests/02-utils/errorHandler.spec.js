import { expect } from 'chai';
import errorHander from '../../utils/errorHandler';

describe('Error Handler Utility Function', () => {
  it('Should the utility file should export a function', done => {
    expect(errorHander).to.be.a('function');
    done();
  });
});
