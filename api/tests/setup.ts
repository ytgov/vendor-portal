/**
 * See https://vitest.dev/config/#setupfiles
 *
 * Run some code before each test file.
 *
 * WARNING: Be very careful of imports in this file!!!
 * Vitest will not mock modules that were imported inside a setup file because they are
 * cached by the time a test file is running.
 * You can do
 * ```ts
 * vi.hoisted(() => {
 *   vi.resetModules()
 * })
 * ```
 * to clear all module caches before running a test file.
 * See: https://vitest.dev/api/vi#vi-mock
 */

import dbMigrationClient from "@/db/db-migration-client"
import { logger } from "@/utils/logger"

import * as matchers from "@/support/matchers"

// Add New Matchers
expect.extend(matchers)

async function getTableNames() {
  const query = /* sql */ `
    SELECT
      table_name AS "tableName"
    FROM
      information_schema.tables
    WHERE
      table_schema = 'dbo'
      AND table_type = 'BASE TABLE'
      AND table_name NOT IN ('knex_migrations' , 'knex_migrations_lock');
  `

  try {
    const result = await dbMigrationClient.raw<{ tableName: string }[]>(query)
    const tableNames = result.map((row) => row.tableName)
    return tableNames
  } catch (error) {
    logger.error("Error fetching table names: " + error)
    throw error
  }
}

async function getTableNamesWithoutIdentityColumn() {
  const query = /* sql */ `
    SELECT
      tables.name AS "tableName"
    FROM
      sys.tables AS tables
    WHERE
      tables.schema_id = SCHEMA_ID('dbo')
      AND NOT EXISTS (
        SELECT 1
        FROM sys.columns AS columns
        WHERE columns.object_id = tables.object_id AND columns.is_identity = 1
      );
  `

  try {
    const result = await dbMigrationClient.raw<{ tableName: string }[]>(query)
    const tableNames = result.map((row) => row.tableName)
    return tableNames
  } catch (error) {
    logger.error("Error fetching table names without identity columns: " + error)
    throw error
  }
}

/**
 * Example of generated SQL commands used for cleaning database:
 *
 * ```sql
 * ALTER TABLE table1 NOCHECK CONSTRAINT ALL;
 * ALTER TABLE table2 NOCHECK CONSTRAINT ALL;
 * ...
 * DELETE FROM table1 WHERE 1=1;
 * DELETE FROM table2 WHERE 1=1;
 * ...
 * DBCC CHECKIDENT ('table1', RESEED, 0);
 * DBCC CHECKIDENT ('table2', RESEED, 0);
 * ...
 * ALTER TABLE table1 CHECK CONSTRAINT ALL;
 * ALTER TABLE table2 CHECK CONSTRAINT ALL;
 * ...
 * ```
 */
async function buildCleanupQuery() {
  const tableNames = await getTableNames()
  const tableNamesWithoutIdentityColumn = await getTableNamesWithoutIdentityColumn()
  const tableNamesWithIdentityColumn = tableNames.filter(
    (tableName) => !tableNamesWithoutIdentityColumn.includes(tableName)
  )
  const disableAllConstraintsQuery = tableNames
    .map((tableName) => /* sql */ `ALTER TABLE ${tableName} NOCHECK CONSTRAINT ALL;`)
    .join("\n")
  const deleteAllInAllTablesQuery = tableNames
    .map((tableName) => /* sql */ `DELETE FROM ${tableName} WHERE 1=1;`)
    .join("\n")
  const resetIdentityColumnsQuery = tableNamesWithIdentityColumn
    .map((tableName) => /* sql */ `DBCC CHECKIDENT ('${tableName}', RESEED, 0);`)
    .join("\n")
  const enableAllConstraintsQuery = tableNames
    .map((tableName) => /* sql */ `ALTER TABLE ${tableName} CHECK CONSTRAINT ALL;`)
    .join("\n")
  const cleanupQuery = [
    disableAllConstraintsQuery,
    deleteAllInAllTablesQuery,
    resetIdentityColumnsQuery,
    enableAllConstraintsQuery,
  ].join("\n")
  return cleanupQuery
}

async function cleanDatabase() {
  const cleanupQuery = await buildCleanupQuery()
  try {
    await dbMigrationClient.raw(cleanupQuery).catch(console.error)
    return true
  } catch (error) {
    logger.error(error)
    return false
  }
}

beforeEach(async () => {
  await cleanDatabase()
})
