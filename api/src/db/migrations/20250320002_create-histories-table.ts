import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("histories", function (table) {
    table.increments("id").notNullable().primary()
    table.integer("entity_id").notNullable()
    table.string("entity_type", 255).notNullable()
    table.string("title", 200).notNullable()
    table.string("subtitle", 400)
    table.text("details")

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
  await knex.schema.dropTable("histories")
}
