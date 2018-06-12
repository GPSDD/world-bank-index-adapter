const nock = require('nock');
const chai = require('chai');
const should = chai.should();

const { getTestServer } = require('./test-server');

const requester = getTestServer();

const dataset = {
    data: {
        id: '00c47f6d-13e6-4a45-8690-897bdaa2c723',
        attributes: {
        }
    }
};

describe('E2E test', () => {
    before(() => {
    });

    it('Load fields should return invalid request', async () => {
        const response = await requester
            .post(`/api/v1/worldbank/fields/${dataset.data.id}`)
            .send({
                dataset,
                loggedUser: null
            });

        response.status.should.equal(400);
        response.body.should.have.property('errors').and.be.a('array').and.lengthOf(1);
        response.body.errors[0].should.have.property('detail').and.equal('This dataset does not support data access through this API. Refer to the dataset\'s metadata for information on how to access the data from the original provider');
    });

    it('Do query should return invalid request', async () => {
        const response = await requester
            .post(`/api/v1/worldbank/query/${dataset.data.id}?sql=`)
            .send({
                dataset,
                loggedUser: null
            });
        response.status.should.equal(400);
        response.body.should.have.property('errors').and.be.a('array').and.lengthOf(1);
        response.body.errors[0].should.have.property('detail').and.equal('This dataset does not support data access through this API. Refer to the dataset\'s metadata for information on how to access the data from the original provider');
    });

    after(() => {
        if (!nock.isDone()) {
            throw new Error(`Not all nock interceptors were used: ${nock.pendingMocks()}`);
        }
    });
});
