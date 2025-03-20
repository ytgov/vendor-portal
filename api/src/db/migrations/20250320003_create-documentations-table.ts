import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("documentations", function (table) {
    table.increments("id").notNullable().primary()
    table.string("name", 100).notNullable()
    table.string("description", 500)
    table.string("format", 1000).notNullable()

    table
      .specificType("created_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETUTCDATE()"))
    table
      .specificType("updated_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETUTCDATE()"))
    table.specificType("deleted_at", "DATETIME2(0)")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("documentations")
}
