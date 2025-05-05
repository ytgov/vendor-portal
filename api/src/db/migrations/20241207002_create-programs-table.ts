import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("programs", function (table) {
    table.increments("id").notNullable().primary()
    table.string("slug", 100).notNullable()
    table.specificType("start_date", "DATETIME2(0)")
    table.specificType("end_date", "DATETIME2(0)")
    table.string("department", 100).notNullable()
    table.string("offered_by", 200).notNullable()
    table.boolean("is_active").notNullable().defaultTo(true)
    table.string("name", 150).notNullable()
    table.string("description", 2000)

    table
      .specificType("created_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETUTCDATE()"))
    table
      .specificType("updated_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETUTCDATE()"))
    table.specificType("deleted_at", "DATETIME2(0)")

    table.unique(["slug"], {
      indexName: "programs_slug_unique",
      predicate: knex.whereNull("deleted_at"),
    })
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("programs")
}
