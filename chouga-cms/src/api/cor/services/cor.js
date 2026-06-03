'use strict';

/**
 * cor service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::cor.cor');
