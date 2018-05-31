const logger = require('logger');
const url = require('url');
const requestPromise = require('request-promise');
const config = require('config');
const ctRegisterMicroservice = require('ct-register-microservice-node');

class WBIndexService {

    static async register(dataset, userId) {
        logger.debug(`Obtaining metadata of indicator ${dataset.tableName}`);
        
        logger.debug('Obtaining metadata of dataset ', `${config.worldbank.metadata}`.replace(':indicator', dataset.tableName));
        try {
            const data = await requestPromise({
                method: 'GET',
                url: `${config.worldbank.metadata}`.replace(':indicator', dataset.tableName),
                json: true
            });
            logger.debug('data', data);
            if (!data || data.length !== 2 || data[1].length !== 1) {
                throw new Error('Format not valid');
            }
            const wbMetadata = data[1][0];
            const metadata = {
                language: 'en',
                name: wbMetadata.name,
                description: wbMetadata.sourceNote,
                sourceOrganization: 'World Bank Group',
                dataSourceUrl: config.worldbank.dataSourceUrl.replace(':indicator', dataset.tableName),
                dataSourceEndpoint: config.worldbank.dataSourceEndpoint.replace(':indicator', dataset.tableName),
                status: 'published',
                license: 'CC BY 4.0',
                userId,
                info: {
                    topics: wbMetadata.topics && Array.isArray(wbMetadata.topics)? wbMetadata.topics.map(e => e.value) : []
                }
            };
            logger.debug('Saving metadata', metadata);
            await ctRegisterMicroservice.requestToMicroservice({
                method: 'POST',
                uri: `/dataset/${dataset.id}/metadata`,
                body: metadata,
                json: true
            });

        } catch (err) {
            logger.error('Error obtaining metadata', err);
            throw new Error('Error obtaining metadata');
        }
    }

}

module.exports = WBIndexService;
