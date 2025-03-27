exports.up = function(knex) {
    return knex.schema.createTable('treats', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('type').notNullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('treats');
  };
