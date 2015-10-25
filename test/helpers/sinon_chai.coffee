sinon = require "sinon"
chai = require "chai"
sinonChai = require "sinon-chai"
chaiAsPromised = require "chai-as-promised"

chai.use sinonChai
    .use chai.should
    .use chaiAsPromised
    .should()

module.expots = chai: chai, sinon: sinon
