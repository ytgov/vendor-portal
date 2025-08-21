import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("vendor_link_requests", (table) => {
    table.string("business_description", 1000).nullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("vendor_link_requests", (table) => {
    table.dropColumn("business_description")
  })
}
