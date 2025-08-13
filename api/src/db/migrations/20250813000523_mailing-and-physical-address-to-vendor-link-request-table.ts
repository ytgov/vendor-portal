import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("vendor_link_requests", (table) => {
    table.renameColumn("address", "mailing_address")
    table.string("physical_address", 500).nullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("vendor_link_requests", (table) => {
    table.renameColumn("mailing_address", "address")
    table.dropColumn("physical_address")
  })
}
