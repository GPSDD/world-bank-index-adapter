const nock = require('nock');
const chai = require('chai');
const should = chai.should();
const { WB_API_METADATA_RESPONSE, WB_DATASET_CREATE_REQUEST, WB_API_METADATA, WB_API_FAKE_METADATA_RESPONSE, WB_FAKE_DATASET_CREATE_REQUEST } = require('./test.constants');
const config = require('config');

const { getTestServer } = require('./test-server');

const requester = getTestServer();

describe('E2E test', () => {
    before(() => {
    });

    it('Create a dataset for an indicator that doesn\'t exist should return an error', async () => {
        nock('https://api.worldbank.org')
            .get(`/v2/indicators/${WB_FAKE_DATASET_CREATE_REQUEST.connector.tableName}?format=json`)
            .once()
            .reply(200, WB_API_FAKE_METADATA_RESPONSE);
        nock(`${process.env.CT_URL}`)
            .patch(`/v1/dataset/${WB_FAKE_DATASET_CREATE_REQUEST.connector.id}`, (request) => {
                const expectedRequestContent = {
                    dataset: {
                        status: 2,
                        errorMessage: `Error - Error obtaining metadata: Error: WB metadata format not valid`
                    }
                };

                request.should.deep.equal(expectedRequestContent);
                return true;
            })
            .once()
            .reply(200);

        const response = await requester
            .post(`/api/v1/worldbank/rest-datasets/worldbank`)
            .send(WB_FAKE_DATASET_CREATE_REQUEST);
        response.status.should.equal(200);
    });

    it('Create dataset should be successful (happy case)', async () => {
        nock('https://api.worldbank.org')
            .get(`/v2/indicators/${WB_DATASET_CREATE_REQUEST.connector.tableName}?format=json`)
            .once()
            .reply(200, WB_API_METADATA_RESPONSE);

        nock(`${process.env.CT_URL}`)
            .post(`/v1/dataset/${WB_DATASET_CREATE_REQUEST.connector.id}/metadata`, (body) => {
                const expectedRequestBody = {
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
                };

                body.should.deep.equal(expectedRequestBody);
                return true;
            })
            .reply(200);

        nock(`${process.env.CT_URL}`)
            .patch(`/v1/dataset/${WB_DATASET_CREATE_REQUEST.connector.id}`, {
                dataset: {
                    status: 1
                }
            })
            .once()
            .reply(200);

        nock(`${process.env.CT_URL}`)
            .post(`/v1/dataset/${WB_DATASET_CREATE_REQUEST.connector.id}/vocabulary/legacy`, (body) => {
                const expectedRequestBody = {
                    tags: ['worldbank']
                };

                body.should.deep.equal(expectedRequestBody);
                return true;
            })
            .once()
            .reply(200);

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
