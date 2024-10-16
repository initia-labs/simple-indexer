import { BlockResponse, TxData } from '@cosmjs/tendermint-rpc/build/comet38'
import { TxEntity } from 'orm'
import { EntityManager } from 'typeorm'

// save tx
export async function saveTx(
  manager: EntityManager,
  block: BlockResponse,
  tx: TxData & { txhash: string }
) {
  const repo = manager.getRepository(TxEntity)

  const txEntity: TxEntity = {
    txhash: tx.txhash,
    height: block.block.header.height,
    raw_log: tx.log ?? '',
    gas_wanted: Number(tx.gasWanted),
    gas_used: Number(tx.gasUsed),
    tx: Buffer.from(tx.data ?? []).toString('base64'),
    timestamp: new Date(block.block.header.time.toISOString()),
    code: tx.code,
  }
  await repo.save(txEntity)

  return true
}
