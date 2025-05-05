import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("vendor_documentations", function (table) {
    table.increments("id").notNullable().primary()
    table.integer("vendor_id").notNullable().references("id").inTable("vendors")
    table.integer("documentation_id").notNullable().references("id").inTable("documentations")
    table.integer("created_by_user_id").notNullable().references("id").inTable("users")
    table.string("status", 100).notNullable()
    table.specificType("expires_at", "DATETIME2(0)")
    table.integer("review_by_user_id").references("id").inTable("users")
    table.specificType("review_at", "DATETIME2(0)")
    table.string("review_notes", 2000)
    table.text("text_value")
    table.string("file_name", 200)
    table.string("mime_type", 200)
    table.integer("size")
    table.binary("content")

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
  await knex.schema.dropTable("vendor_documentations")
}
