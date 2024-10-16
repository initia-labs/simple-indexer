import { BlockResponse } from '@cosmjs/tendermint-rpc/build/comet38'
import { EventWithInfo } from 'lib'
import { DepositEntity } from 'orm'
import { EntityManager } from 'typeorm'

// save deposit event
export async function saveDepositEvent(
  manager: EntityManager,
  _block: BlockResponse,
  event: EventWithInfo
) {
  const repo = manager.getRepository(DepositEntity)
  const txhash = event.txhash === '' ? `nontx:${event.height}` : event.txhash
  const depositEvent = parseMoveEvent<DepositEvent>(
    event,
    '0x1::fungible_asset::DepositEvent'
  )
  if (!depositEvent) return false

  await repo.save({
    txhash,
    storeAddr: depositEvent.data.store_addr,
    coinMetadata: depositEvent.data.metadata_addr,
    amount: depositEvent.data.amount,
  })

  return true
}

function parseMoveEvent<T>(
  event: EventWithInfo,
  structTag: string
): MoveEvent<T> | undefined {
  if (event.type !== 'move') return
  const moveEvent = {
    structTag: event.attributes[0].value,
    data: JSON.parse(event.attributes[1].value) as T,
  }

  if (moveEvent.structTag !== structTag) return

  return moveEvent
}

declare interface MoveEvent<T> {
  structTag: string
  data: T
}

interface DepositEvent {
  store_addr: string
  metadata_addr: string
  amount: string
}
