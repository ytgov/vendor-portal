import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("vendors", function (table) {
    table.increments("id").notNullable().primary()
    table.string("slug", 100).notNullable()
    table.string("status", 100).notNullable()
    table.string("org", 10).notNullable()
    table.string("vendor_id", 50).notNullable()
    table.string("name", 150).notNullable()
    table.string("short_name", 50).notNullable()
    table.boolean("is_active").notNullable().defaultTo(true)
    table.boolean("is_person").notNullable().defaultTo(false)
    table.boolean("is_payable").notNullable().defaultTo(true)
    table.boolean("is_electronic_pay").notNullable().defaultTo(true)
    table.string("address_line_1", 100).notNullable()
    table.string("address_line_2", 100).notNullable()
    table.string("address_province", 100).notNullable()
    table.string("address_postal", 20).notNullable()

    table
      .specificType("created_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETUTCDATE()"))
    table
      .specificType("updated_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETUTCDATE()"))
    table.specificType("deleted_at", "DATETIME2(0)")

    table.unique(["org", "vendor_id"], {
      indexName: "vendors_org_vendor_id_unique",
      predicate: knex.whereNull("deleted_at"),
    })
    table.unique(["slug"], {
      indexName: "vendors_slug_unique",
      predicate: knex.whereNull("deleted_at"),
    })
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("vendors")
}
