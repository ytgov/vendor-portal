import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("vendor_users", function (table) {
    table.increments("id").notNullable().primary()
    table.integer("vendor_id").notNullable().references("id").inTable("vendors")
    table.integer("user_id").notNullable().references("id").inTable("users")
    table.integer("program_id").references("id").inTable("programs")
    table.boolean("is_active").notNullable().defaultTo(false)
    table.boolean("is_admin").notNullable().defaultTo(false)

    table.integer("decision_by_user_id").references("id").inTable("users")
    table.specificType("decision_at", "DATETIME2(0)")

    table
      .specificType("created_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETUTCDATE()"))
    table
      .specificType("updated_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETUTCDATE()"))
    table.specificType("deleted_at", "DATETIME2(0)")

    table.unique(["vendor_id", "user_id"], {
      indexName: "vendor_users_vendor_user_unique",
      predicate: knex.whereNull("deleted_at"),
    })
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("vendor_users")
}
