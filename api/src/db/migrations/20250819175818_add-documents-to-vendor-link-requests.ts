import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("vendor_link_requests", (table) => {
    table.string("ycor_registration_document_file_name")
    table.string("ycor_registration_document_mime_type")
    table.integer("ycor_registration_document_size")
    table.binary("ycor_registration_document_content")

    table.string("most_recent_utility_bill_file_name")
    table.string("most_recent_utility_bill_mime_type")
    table.integer("most_recent_utility_bill_size")
    table.binary("most_recent_utility_bill_content")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("vendor_link_requests", (table) => {
    table.dropColumn("ycor_registration_document_file_name")
    table.dropColumn("ycor_registration_document_mime_type")
    table.dropColumn("ycor_registration_document_size")
    table.dropColumn("ycor_registration_document_content")

    table.dropColumn("most_recent_utility_bill_file_name")
    table.dropColumn("most_recent_utility_bill_mime_type")
    table.dropColumn("most_recent_utility_bill_size")
    table.dropColumn("most_recent_utility_bill_content")
  })
}
