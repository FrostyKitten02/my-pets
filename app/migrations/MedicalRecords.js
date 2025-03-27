exports.up = function (knex) {
  return knex.schema.createTable('medical_records', function (table) {
    table.increments('id').primary();
    table.text('diagnosis').notNullable();
    table.text('treatment');
    table.dateTime('record_date').notNullable();
    table.integer('pet_id').unsigned().notNullable().references('id').inTable('pet').onDelete('CASCADE');
    table.integer('veterinary_visits_id').unsigned().references('id').inTable('veterinary_visits').onDelete('SET NULL');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('veterinary_visits');
};