exports.up = function(knex) {
    return knex.schema.createTable('user', function(table) {
        table.increments('id').primary();
        table.string('username').notNullable();
        table.string('password').notNullable();
        table.string('email').notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('user');
};
