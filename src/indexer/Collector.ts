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

  async collectBlock(manager: EntityManager): Promise<void> {
    const block = await config.lcd.tendermint.blockInfo(this.currentHeight)

    const blockEntity: BlockEntity = {
      chain_id: block.block.header.chain_id,
      height: block.block.header.height,
      version: block.block.header.version,
      hash: block.block_id.hash,
      time: block.block.header.time,
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

    await this.helper.saveEntity(manager, BlockEntity, blockEntity)
  }

  async collectTx(manager: EntityManager): Promise<void> {
    const txSearchRes = await config.lcd.tx.search({
      query: [{ key: 'tx.height', value: this.currentHeight.toString() }],
    })
    for (const txInfo of txSearchRes.txs) {
      const entity: TxEntity = {
        txhash: txInfo.txhash,
        height: txInfo.height,
        raw_log: txInfo.raw_log,
        logs: txInfo?.logs ?? null,
        gas_wanted: txInfo.gas_wanted,
        gas_used: txInfo.gas_used,
        tx: txInfo.tx,
        timestamp: txInfo.timestamp,
        events: txInfo.events,
        code: txInfo?.code ?? null,
        codespace: txInfo?.codespace ?? null,
      }

      await this.helper.saveEntity(manager, TxEntity, entity)
    }
  }

  async collectEvent(
    manager: EntityManager,
    eventType: string
  ): Promise<boolean> {
    const [isEmpty, events] = await this.helper.fetchEvents(
      config.lcd,
      this.currentHeight,
      eventType
    )

    if (isEmpty) return false

    for (const evt of events) {
      const attrMap = this.helper.eventsToAttrMap(evt)
      await this.helper.saveEntity(manager, EventEntity, {
        type_tag: attrMap['type_tag'],
        data: attrMap['data'],
      })
    }

    return true
  }

  public async handleBlock(manager: EntityManager): Promise<any> {
    await this.collectBlock(manager)
    await this.collectTx(manager)
  }

  public async handleEvents(manager: EntityManager): Promise<any> {
    // set eventType that you want to collect
    const isMoveEventExist = await this.collectEvent(manager, 'move')
    return isMoveEventExist
  }
}
