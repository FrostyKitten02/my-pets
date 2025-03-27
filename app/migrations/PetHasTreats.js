exports.up = function (knex) {
  return knex.schema.createTable('pet_has_treats', function (table) {
    table.increments('id').primary();
    table.dateTime('time').notNullable();
    table.integer('quantity').notNullable();
    table.text('notes');
    table.boolean('is_favorite').defaultTo(false);
    table.integer('pet_id').unsigned().notNullable().references('id').inTable('pet').onDelete('CASCADE');
    table.integer('treat_id').unsigned().notNullable().references('id').inTable('treats').onDelete('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('pet_has_treats');
};