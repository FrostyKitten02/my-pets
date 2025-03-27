exports.up = function (knex) {
  return knex.schema.createTable('veterinary_visits', function (table) {
    table.increments('id').primary();
    table.dateTime('date').notNullable();
    table.string('type', 45).notNullable();
    table.text('description');
    table.string('veterinarian', 45).notNullable();
    table.decimal('cost');
    table.integer('pet_id').unsigned().notNullable().references('id').inTable('pet').onDelete('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('veterinary_visits');
};