exports.up = function (knex) {
    return knex.schema
      .createTable('posts', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('title').notNullable();
        table.text('description').notNullable();
        table.string('country').notNullable();
        table.string('image_path').notNullable();
        table.decimal('lat').notNullable();
        table.decimal('long').notNullable();
        table.integer('year').notNullable();
      })
      .createTable('attractions', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.text('description').notNullable();
        table.string('image_path').notNullable();
        table
          .integer('post_id')
          .unsigned()
          .references('id')
          .inTable('posts')
          .onUpdate('CASCADE')
          .onDelete('SET NULL');
      });
  };
  exports.down = function (knex) {
    return knex.schema.dropTable('attractions').dropTable('posts');
  };