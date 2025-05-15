import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("documentations", (table) => {
    table.boolean("expires").notNullable().defaultTo(false)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("documentations", (table) => {
    table.dropColumn("expires")
  })
}
