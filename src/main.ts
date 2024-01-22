import { runBot } from 'indexer'
import { initServer, finalizeServer } from 'loader'
import { once } from 'lodash'
import { initORM, finalizeORM } from 'orm'

async function gracefulShutdown(): Promise<void> {
  finalizeServer()
  await finalizeORM()
  process.exit(0)
}

export async function startBot(): Promise<void> {
  await initORM()
  await runBot()
  await initServer()

  // attach graceful shutdown
  const signals = ['SIGHUP', 'SIGINT', 'SIGTERM'] as const
  signals.forEach((signal) => process.on(signal, once(gracefulShutdown)))
}

if (require.main === module) {
  startBot().catch(console.log)
}
