import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("vendor_link_requests", function (table) {
    table.increments("id").notNullable().primary()
    table.integer("user_id").notNullable().references("id").inTable("users")

    table.string("matched_vendor_id", 50)
    table.string("business_name", 150)
    table.string("operating_name", 150)
    table.string("ycor_number", 50)
    table.string("address", 500)
    table.string("vendor_id", 50)

    table.string("status", 100).notNullable()
    table.integer("decision_by_user_id").references("id").inTable("users")
    table.specificType("decision_at", "DATETIME2(0)")
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
  await knex.schema.dropTable("vendor_link_requests")
}
