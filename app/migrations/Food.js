exports.up = function(knex) {
    return knex.schema.createTable('food', function(table) {
      table.increments('id').primary();
      table.string('name', 45).notNullable();
      table.date('expiration_date');
      table.string('warnings', 255);
      table.text('ingredients');
      table.text('nutritional_value');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('food');
  };
