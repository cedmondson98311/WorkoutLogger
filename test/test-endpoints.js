const {app} = require('../server.js');

const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();

chai.use(chaiHttp);

describe('GET endpoint', function() {
	it('should return index.html on request to root directory', function() {
		return chai.request(app)
		.get('/')
		.then(function(res) {
			res.should.have.status(200);
			res.should.have.header('content-type', 'text/html; charset=UTF-8');
		});
	});
});