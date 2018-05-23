const logger = require('logger');
const url = require('url');
const requestPromise = require('request-promise');

class WBIndexService {

    static async getFields(urlDataset, tableName) {
        logger.debug(`Obtaining fields of ${url} and table ${tableName}`);
        const parsedUrl = url.parse(urlDataset);
        logger.debug('Doing request to ', `https://${parsedUrl.host}/api/v2/sql?q=select * from ${tableName} limit 0`);
        try {
            const result = await requestPromise({
                method: 'GET',
                uri: `https://${parsedUrl.host}/api/v2/sql?q=select * from ${tableName} limit 0`,
                json: true
            });
            return result.fields;
        } catch (err) {
            logger.error('Error obtaining fields', err);
            throw new Error('Error obtaining fields');
        }
    }

}

module.exports = WBIndexService;
