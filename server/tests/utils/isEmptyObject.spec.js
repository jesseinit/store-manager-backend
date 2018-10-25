import { expect } from 'chai';
import isEmptyObject from '../../utils/isEmptyObject';

const emptyObject = {};
const nonEmptyObject = { hello: 'Hi' };

describe('Empty Object Utility Function', () => {
  it('The utility file should export a function', done => {
    expect(isEmptyObject).to.be.a('function');
    done();
  });

  it('Should return true if the object is empty', done => {
    expect(isEmptyObject(emptyObject)).to.be.a('boolean');
    expect(isEmptyObject(emptyObject)).to.equal(true);
    done();
  });

  it('Should return false if the object is not empty', done => {
    expect(isEmptyObject(nonEmptyObject)).to.be.a('boolean');
    expect(isEmptyObject(nonEmptyObject)).to.equal(false);
    done();
  });
});
