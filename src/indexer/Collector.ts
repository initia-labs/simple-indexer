import { BlockResponse, TxData } from '@cosmjs/tendermint-rpc/build/comet38'
import { delay } from 'bluebird'
import { EventWithInfo, eventToEventWithInfo, getTxHash } from 'lib'
import { createLoggerWithPrefix } from 'lib/logger'
import { RPCClient } from 'lib/rpcClient'
import { StateEntity } from 'orm'
import { EntityManager } from 'typeorm'
import { Logger } from 'winston'

export class Collector {
  private syncedHeight: number
  private latestHeight: number
  private logger: Logger
  constructor(
    private rpcClient: RPCClient,
    private startHeight: number,
    private config: IndexerConfig,
    private entityManger: EntityManager,
    private blockIndexers: BlockIndexer[],
    private txIndexers: TxIndexer[],
    private eventIndexers: EventIndexer[]
  ) {
    this.logger = createLoggerWithPrefix('collector')
    this.latestHeight = -1
    this.syncedHeight = -1
    // run latestHeightWorker
    this.latestHeightWorker()

    // run indexer worker
    this.indexerWorker()
  }

  private async latestHeightWorker() {
    let retired = 0
    for (;;) {
      if (retired >= this.config.latestHeightUpdateMaxRetry) {
        throw Error('[latestHeightWorker] reach max retry')
      }
      try {
        this.latestHeight = await this.rpcClient.queryLatestHeight()
        retired = 0
      } catch (e) {
        retired++
        this.logger.warning(
          `[latestHeightWorker] Failed to get latest height due to ${e}. Retry: (${retired}/${this.config.latestHeightUpdateMaxRetry})`
        )
      }
      await delay(this.config.latestHeightUpdateInterval)
    }
  }

  private async indexerWorker() {
    // initialize synced height
    if (this.syncedHeight === -1) {
      const state = await this.entityManger
        .getRepository(StateEntity)
        .findOne({ where: { name: 'collector' } })
      if (state === null) {
        await this.entityManger
          .getRepository(StateEntity)
          .insert({ name: 'collector', height: this.startHeight })
        this.syncedHeight = this.startHeight
      } else {
        this.syncedHeight = state.height
      }
    }

    for (;;) {
      // heights to fetch
      const heights = Array.from(
        { length: 20 },
        (_, i) => i + this.syncedHeight + 1
      ).filter((height) => height <= this.latestHeight)

      // fetch blocks
      const blocks = await Promise.all(
        heights.map((height) => this.fetchBlock(height))
      )

      this.logger.debug(
        `Fetched block results for heights (${JSON.stringify(heights)})`
      )

      for (const block of blocks) {
        const height = block.block.block.header.height
        await this.entityManger.transaction(async (manager) => {
          // run block indexers
          for (const blockIndexer of this.blockIndexers) {
            await blockIndexer(manager, block.block)
          }

          // run tx indexers
          for (const tx of block.txs) {
            for (const txIndexer of this.txIndexers) {
              const skip = await txIndexer(manager, block.block, tx)
              if (skip) continue
            }
          }

          // run event indexers
          for (const event of block.events) {
            for (const eventIndexer of this.eventIndexers) {
              const skip = await eventIndexer(manager, block.block, event)
              if (skip) continue
            }
          }

          // update synced height
          const stateRepo = manager.getRepository(StateEntity)
          await stateRepo.update({ name: 'collector' }, { height })
          this.syncedHeight = height
        })
      }

      await delay(100)
    }
  }

  private async fetchBlock(height: number) {
    this.logger.debug(`Fecth new block results (height - ${height})`)
    const blockResults = await this.rpcClient.blockResults(height)
    const block = await this.rpcClient.block(height)
    const timestamp = block.block.header.time.toISOString()
    const txhashes = block.block.txs.map(getTxHash)

    const txs: (TxData & { txhash: string })[] = []
    const events: EventWithInfo[] = []

    // parse events from begin block
    blockResults.beginBlockEvents.map((event) => {
      events.push(eventToEventWithInfo(event, timestamp, '', height))
    })

    // parse events from txs
    blockResults.results.map((res, i) => {
      txs.push({ ...res, txhash: txhashes[i] })
      res.events.map((event) => {
        events.push(eventToEventWithInfo(event, timestamp, txhashes[i], height))
      })
    })

    // parse events from end block
    blockResults.endBlockEvents.map((event) => {
      events.push(eventToEventWithInfo(event, timestamp, '', height))
    })

    return {
      block,
      txs,
      events,
    }
  }
}

type BlockIndexer = (
  manager: EntityManager,
  block: BlockResponse
) => Promise<void>

type TxIndexer = (
  manager: EntityManager,
  block: BlockResponse,
  tx: TxData
) => Promise<boolean>

type EventIndexer = (
  manager: EntityManager,
  block: BlockResponse,
  event: EventWithInfo
) => Promise<boolean>

interface IndexerConfig {
  latestHeightUpdateInterval: number
  latestHeightUpdateMaxRetry: number
}
