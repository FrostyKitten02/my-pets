//import this if you need to access database

const database = require('knex')({
    client: 'pg',
    connection: 'postgres://localhost:5432/my-pets?user=postgres&password=admin',
    searchPath: ['knex', 'public'],
});

module.exports = database;