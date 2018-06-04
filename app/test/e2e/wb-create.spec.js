const nock = require('nock');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const { WB_API_METADATA_RESPONSE, WB_DATASET_CREATE_REQUEST, WB_API_METADATA } = require('./test.constants');
const config = require('config');

let requester;

chai.use(chaiHttp);

describe('E2E test', () => {
    before(() => {

        nock(`${process.env.CT_URL}`)
            .persist()
            .post(`/api/v1/microservice`)
            .reply(200);
        nock('https://api.worldbank.org')
            .get(`/v2/indicators/per_si_allsi.cov_pop_tot?format=json`)
            .reply(200, WB_API_METADATA_RESPONSE);

        // Metadata creation request
        nock(`${process.env.CT_URL}`)
            .post(`/v1/dataset/${WB_DATASET_CREATE_REQUEST.connector.id}/metadata`, {
                language: 'en',
                name: WB_API_METADATA.name,
                description: WB_API_METADATA.sourceNote,
                sourceOrganization: 'World Bank Group',
                dataSourceUrl: config.worldbank.dataSourceUrl.replace(':indicator', 'per_si_allsi.cov_pop_tot'),
                dataSourceEndpoint: config.worldbank.dataSourceEndpoint.replace(':indicator', 'per_si_allsi.cov_pop_tot'),
                status: 'published',
                license: 'CC-BY',
                userId: '1a10d7c6e0a37126611fd7a7',
                info: {
                    topics: WB_API_METADATA.topics && Array.isArray(WB_API_METADATA.topics) ? WB_API_METADATA.topics.map(e => e.value) : []
                }
            })
            .reply(200);

        // Metadata update request
        nock(`${process.env.CT_URL}`)
            .patch(`/v1/dataset/${WB_DATASET_CREATE_REQUEST.connector.id}`, {
                dataset: {
                    status: 1
                }
            })
            .reply(200);

        const server = require('../../src/app');
        requester = chai.request(server).keepOpen();
    });

    it('Create dataset should be successful (happy case)', async () => {
        const response = await requester
            .post(`/api/v1/worldbank/rest-datasets/worldbank`)
            .send(WB_DATASET_CREATE_REQUEST);
        response.status.should.equal(200);
    });

    after(() => {
    });
});
