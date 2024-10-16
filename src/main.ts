import { initServer } from 'api/main'
import { runCollector } from 'indexer'
import { once } from 'lodash'
import { initORM, finalizeORM, getDB } from 'orm'

async function gracefulShutdown(): Promise<void> {
  await finalizeORM()
  process.exit(0)
}

export async function startBot(): Promise<void> {
  await initORM()
  runCollector(getDB()[0].createEntityManager())
  await initServer()

  // attach graceful shutdown
  const signals = ['SIGHUP', 'SIGINT', 'SIGTERM'] as const
  signals.forEach((signal) => process.on(signal, once(gracefulShutdown)))
}

if (require.main === module) {
  startBot().catch(console.log)
}
