import { RPCClient } from 'lib/rpcClient'
import { Collector } from './Collector'
import { config } from 'config'
import { EntityManager } from 'typeorm'
import { saveBlock } from './blockIndexers'
import { saveTx } from './txIndexers'
import { saveDepositEvent } from './eventIndexers'

export function runCollector(manager: EntityManager): void {
  new Collector(
    new RPCClient(config.rpcUrl),
    config.startHeight,
    {
      latestHeightUpdateInterval: 1000,
      latestHeightUpdateMaxRetry: 10,
    },
    manager,
    [saveBlock],
    [saveTx],
    [saveDepositEvent]
  )
}
