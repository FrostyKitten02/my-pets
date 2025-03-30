exports.up = function(knex) {
    return knex.schema.createTable('pet', function(table) {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('type').notNullable(); //cat, dog etc.
        table.string('breed'); //pasma
        table.date('birthDate');
        table.enu('sex', ['M', 'F']).notNullable();
        table.integer('weight');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('pet');
};
