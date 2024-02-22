import { Monitor } from './Monitor'
import { BlockEntity, TxEntity, getDB } from 'orm'
import { EntityManager } from 'typeorm'
import { RPCClient, RPCSocket } from 'lib/rpc'
import { config } from 'config'
import { EventEntity } from 'orm/EventEntity'

export class Collector extends Monitor {
  constructor(
    public socket: RPCSocket,
    public rpcClient: RPCClient
  ) {
    super(socket, rpcClient)
    ;[this.db] = getDB()
  }

  public name(): string {
    return 'indexer'
  }

  async collect(manager: EntityManager): Promise<void> {
    const [block, txSearchRes] = await Promise.all([
      config.lcd.tendermint.blockInfo(this.currentHeight),
      config.lcd.tx.search({
        query: [{ key: 'tx.height', value: this.currentHeight.toString() }],
      }),
    ])

    const blockEntity: BlockEntity = {
      chain_id: block.block.header.chain_id,
      height: parseInt(block.block.header.height),
      version: block.block.header.version,
      hash: block.block_id.hash,
      time: new Date(block.block.header.time),
      last_block_id: block.block.header.last_block_id,
      last_commit_hash: block.block.header.last_commit_hash,
      data_hash: block.block.header.data_hash,
      validators_hash: block.block.header.validators_hash,
      next_validators_hash: block.block.header.next_validators_hash,
      consensus_hash: block.block.header.consensus_hash,
      app_hash: block.block.header.app_hash,
      last_results_hash: block.block.header.last_results_hash,
      evidence_hash: block.block.header.evidence_hash,
      proposer_address: block.block.header.proposer_address,
    }

    await manager.getRepository(BlockEntity).save(blockEntity)

    let txEntities: TxEntity[] = []
    let eventEntities: EventEntity[] = []

    for (const txInfo of txSearchRes.txs) {
      if (txInfo.code !== 0) continue

      const entity: TxEntity = {
        txhash: txInfo.txhash,
        height: txInfo.height,
        raw_log: txInfo.raw_log,
        gas_wanted: txInfo.gas_wanted,
        gas_used: txInfo.gas_used,
        tx: txInfo.tx,
        timestamp: new Date(txInfo.timestamp),
        code: txInfo.code,
        codespace: txInfo.codespace,
      }

      const entities: EventEntity[] = txInfo.events.map((event, index) => {
        const attributes: { [key: string]: string } = event.attributes.reduce(
          (obj, attr) => {
            obj[attr.key] = attr.value
            return obj
          },
          {}
        )

        return {
          txhash: txInfo.txhash,
          index,
          type_tag: event.type,
          attributes,
          tx: entity,
        }
      })

      txEntities = [...txEntities, entity]
      eventEntities = [...eventEntities, ...entities]
    }

    await manager.getRepository(TxEntity).save(txEntities)
    await manager.getRepository(EventEntity).save(eventEntities)
  }

  public async handleBlock(manager: EntityManager): Promise<void> {
    await this.collect(manager)
  }
}
