const logger = require('logger');
const url = require('url');
const requestPromise = require('request-promise');
const config = require('config');
const ctRegisterMicroservice = require('ct-register-microservice-node');

class WBIndexService {

    static async cronUpdate() {
        const timeout = ms => new Promise(res => setTimeout(res, ms))
        try {
            logger.info('Running cron update');
            logger.debug('Obtaining datasets');
            const datasets = await ctRegisterMicroservice.requestToMicroservice({
                method: 'GET',
                uri: `/dataset?provider=worldbank&page[size]=99999&status=saved`,
                json: true
            });
            if (datasets && datasets.data) {
                for (let i = 0, length = datasets.data.length; i < length; i++) {
                    try {
                        const dataset = datasets.data[i].attributes;
                        dataset.id = datasets.data[i].id;
                        await timeout(1000);
                        await WBIndexService.register(dataset, dataset.userId, true);
                    } catch (err) {
                        logger.error('Error updating dataset', err);
                    }
                }
            }
        } catch (err) {
            logger.error('Error in cron update', err);
            throw err;
        }
    }

    static async register(dataset, userId, update = false) {
        logger.debug(`Obtaining metadata of indicator ${dataset.tableName}`);

        logger.debug('Obtaining metadata of dataset ', `${config.worldbank.metadata}`.replace(':indicator', dataset.tableName));

        let wbMetadata;
        try {
            const data = await requestPromise({
                method: 'GET',
                url: `${config.worldbank.metadata}`.replace(':indicator', dataset.tableName),
                json: true
            });
            logger.debug('data', data);
            if (!data || data.length !== 2 || data[1].length !== 1) {
                throw new Error('WB metadata format not valid');
            }
            wbMetadata = data[1][0];
            const metadata = {
                language: 'en',
                name: wbMetadata.name,
                description: wbMetadata.sourceNote,
                sourceOrganization: 'World Bank Group',
                dataSourceUrl: config.worldbank.dataSourceUrl.replace(':indicator', dataset.tableName),
                dataSourceEndpoint: config.worldbank.dataSourceEndpoint.replace(':indicator', dataset.tableName),
                dataDownloadUrl: config.worldbank.dataSourceEndpoint.replace(':indicator', dataset.tableName),
                status: 'published',
                license: 'CC-BY',
                userId,
                info: {
                    topics: wbMetadata.topics && Array.isArray(wbMetadata.topics) ? wbMetadata.topics.map(e => e.value) : []
                }
            };

            logger.debug('Saving metadata', metadata);
            if (!update) {
                await ctRegisterMicroservice.requestToMicroservice({
                    method: 'POST',
                    uri: `/dataset/${dataset.id}/metadata`,
                    body: metadata,
                    json: true
                });
            } else {
                await ctRegisterMicroservice.requestToMicroservice({
                    method: 'PATCH',
                    uri: `/dataset/${dataset.id}/metadata`,
                    body: metadata,
                    json: true
                });
            }

        } catch (err) {
            logger.error('Error obtaining metadata', err);
            throw new Error(`Error obtaining metadata: ${err}`);
        }

        if (!update) {
            const tags = ['worldbank'];

            if (wbMetadata.topics && Array.isArray(wbMetadata.topics)) {
                wbMetadata.topics.forEach(e => tags.push(e.value));
            }

            try {
                logger.debug('Tagging dataset for WB dataset', dataset.tableName);
                await ctRegisterMicroservice.requestToMicroservice({
                    method: 'POST',
                    uri: `/dataset/${dataset.id}/vocabulary/legacy`,
                    body: {
                        tags
                    },
                    json: true
                });
            } catch (err) {
                logger.error('Error tagging dataset', err);
                throw new Error(`Error tagging dataset: ${err}`);
            }
        }
    }

}

module.exports = WBIndexService;
