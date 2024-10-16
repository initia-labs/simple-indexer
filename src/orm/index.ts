import 'reflect-metadata'
import Bluebird from 'bluebird'
import { ConnectionOptionsReader, DataSource, DataSourceOptions } from 'typeorm'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
import { CamelToSnakeNamingStrategy } from './CamelToSnakeNamingStrategy'

import debugModule from 'debug'
const debug = debugModule('orm')

import { TxEntity } from './TxEntity'
import { StateEntity } from './StateEntity'
import { BlockEntity } from './BlockEntity'
import { DepositEntity } from './DepositEntity'

export * from './TxEntity'
export * from './StateEntity'
export * from './BlockEntity'
export * from './DepositEntity'

export const staticOptions = {
  supportBigNumbers: true,
  bigNumberStrings: true,
  entities: [TxEntity, StateEntity, BlockEntity, DepositEntity],
}

let DB: DataSource[] = []

function initConnection(options: DataSourceOptions): Promise<DataSource> {
  const pgOpts = options as PostgresConnectionOptions
  debug(
    `creating connection default to ${pgOpts.username}@${pgOpts.host}:${
      pgOpts.port || 5432
    }`
  )

  return new DataSource({
    ...options,
    ...staticOptions,
    namingStrategy: new CamelToSnakeNamingStrategy(),
  }).initialize()
}

export async function initORM(host?: string, port?: number): Promise<void> {
  const reader = new ConnectionOptionsReader()
  const options = (await reader.all()) as PostgresConnectionOptions[]

  DB = await Bluebird.map(options, (opt) => {
    const newOptions = { ...opt }
    if (host) {
      newOptions.host = host
    }
    if (port) {
      newOptions.port = port
    }
    return initConnection(newOptions)
  })
}

export function getDB(): DataSource[] {
  if (!DB) {
    throw new Error('DB not initialized')
  }
  return DB
}

export async function finalizeORM(): Promise<void> {
  await Promise.all(DB.map((c) => c.destroy()))
}
