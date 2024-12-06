import { logger } from "@/utils/logger"
import * as fs from "fs/promises"
import * as path from "path"

const NON_INITIALIZER_REGEX = /^index\.(ts|js)$/

export async function importAndExecuteInitializers() {
  const files = await fs.readdir(__dirname)

  for (const file of files) {
    if (NON_INITIALIZER_REGEX.test(file)) continue

    const modulePath = path.join(__dirname, file)
    logger.info(`Running initializer: ${modulePath}`)

    try {
      const { default: initializerAction } = await require(modulePath)
      await initializerAction()
    } catch (error) {
      logger.error(`Failed to run initializer: ${modulePath}`, { error })
      throw error
    }
  }

  return true
}

if (require.main === module) {
  // TODO: add some kind of middleware that 503s? if initialization failed?
  ;(async () => {
    try {
      await importAndExecuteInitializers()
    } catch {
      logger.error("Failed to complete initialization!")
    }

    process.exit(0)
  })()
}
