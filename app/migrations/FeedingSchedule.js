exports.up = function (knex) {
  return knex.schema.createTable('feeding_schedule', function (table) {
    table.increments('id').primary();
    table.integer('quantity').notNullable();
    table.time('feeding_time').notNullable();
    table.text('notes');
    table.integer('pet_id').unsigned().references('id').inTable('pet').onDelete('CASCADE');
    table.integer('food_id').unsigned().references('id').inTable('food').onDelete('SET NULL');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('feeding_schedule');
};