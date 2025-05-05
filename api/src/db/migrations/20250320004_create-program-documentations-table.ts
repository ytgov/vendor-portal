import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("program_documentations", function (table) {
    table.increments("id").notNullable().primary()
    table.integer("program_id").notNullable().references("id").inTable("programs")
    table.integer("documentation_id").notNullable().references("id").inTable("documentations")
    table.string("purpose", 500)

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
  await knex.schema.dropTable("program_documentations")
}
