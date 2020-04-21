/*jshint esversion: 8 */
const db = require('./modules/db');

const sequelize = db.sequelize;
db.authenticate(sequelize);
db.sync(sequelize);
