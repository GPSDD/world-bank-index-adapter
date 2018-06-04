const CronJob = require('cron').CronJob;
const logger = require('logger');
const WorldBankService = require('services/worldbank.service');
const config = require('config');

logger.info('Initializing cron');
new CronJob(config.cron, async () => {
    return await WorldBankService.cronUpdate();
}, null,
  true, /* Start the job right now */
  'Europe/Madrid' /* Time zone of this job. */
);
