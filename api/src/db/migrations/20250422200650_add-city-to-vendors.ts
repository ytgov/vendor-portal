import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("vendors", (table) => {
    table.string("address_city", 100)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("vendors", (table) => {
    table.dropColumn("address_city")
  })
}
