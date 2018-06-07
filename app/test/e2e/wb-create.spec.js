const nock = require('nock');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const { WB_API_METADATA_RESPONSE, WB_DATASET_CREATE_REQUEST, WB_API_METADATA, WB_API_FAKE_METADATA_RESPONSE, WB_FAKE_DATASET_CREATE_REQUEST } = require('./test.constants');
const config = require('config');

let requester;

chai.use(chaiHttp);

describe('E2E test', () => {
    before(() => {

        nock(`${process.env.CT_URL}`)
            .post(`/api/v1/microservice`)
            .once()
            .reply(200);
        nock('https://api.worldbank.org')
            .get(`/v2/indicators/${WB_DATASET_CREATE_REQUEST.connector.tableName}?format=json`)
            .once()
            .reply(200, WB_API_METADATA_RESPONSE);
        nock('https://api.worldbank.org')
            .get(`/v2/indicators/${WB_FAKE_DATASET_CREATE_REQUEST.connector.tableName}?format=json`)
            .once()
            .reply(200, WB_API_FAKE_METADATA_RESPONSE);

        // Metadata creation request
        nock(`${process.env.CT_URL}`)
            .post(`/v1/dataset/${WB_DATASET_CREATE_REQUEST.connector.id}/metadata`, {
                language: 'en',
                name: WB_API_METADATA.name,
                description: WB_API_METADATA.sourceNote,
                sourceOrganization: 'World Bank Group',
                dataSourceUrl: config.worldbank.dataSourceUrl.replace(':indicator', 'per_si_allsi.cov_pop_tot'),
                dataSourceEndpoint: config.worldbank.dataSourceEndpoint.replace(':indicator', 'per_si_allsi.cov_pop_tot'),
                dataDownloadUrl: config.worldbank.dataSourceEndpoint.replace(':indicator', 'per_si_allsi.cov_pop_tot'),
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
            .once()
            .reply(200);


        nock(`${process.env.CT_URL}`)
            .patch(`/v1/dataset/${WB_FAKE_DATASET_CREATE_REQUEST.connector.id}`, {
                dataset: {
                    status: 2,
                    errorMessage: 'Error - Error obtaining metadata'
                }
            })
            .once()
            .reply(200);

        const server = require('../../src/app');
        requester = chai.request(server).keepOpen();
    });

    it('Create a dataset for an indicator that doesn\'t exist should return an error', async () => {
        const response = await requester
            .post(`/api/v1/worldbank/rest-datasets/worldbank`)
            .send(WB_FAKE_DATASET_CREATE_REQUEST);
        response.status.should.equal(200);
    });

    it('Create dataset should be successful (happy case)', async () => {
        const response = await requester
            .post(`/api/v1/worldbank/rest-datasets/worldbank`)
            .send(WB_DATASET_CREATE_REQUEST);
        response.status.should.equal(200);
    });

    after(() => {
        if (!nock.isDone()) {
            throw new Error(`Not all nock interceptors were used: ${nock.pendingMocks()}`);
        }
    });
});
