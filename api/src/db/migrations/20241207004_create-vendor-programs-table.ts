import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("vendor_programs", function (table) {
    table.increments("id").notNullable().primary()
    table.integer("vendor_id").notNullable().references("id").inTable("vendors")
    table.integer("program_id").notNullable().references("id").inTable("programs")
    table.specificType("start_date", "DATETIME2(0)")
    table.specificType("end_date", "DATETIME2(0)")

    table.integer("requested_by_user_id").notNullable().references("id").inTable("users")
    table.specificType("requested_at", "DATETIME2(0)")

    table.string("status", 100).notNullable()
    table.integer("review_by_user_id").references("id").inTable("users")
    table.specificType("review_at", "DATETIME2(0)")
    table.string("review_notes", 2000)

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
  await knex.schema.dropTable("vendor_programs")
}
