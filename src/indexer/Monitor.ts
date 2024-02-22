import Bluebird from 'bluebird'
import { RPCClient, RPCSocket } from 'lib/rpc'
import { StateEntity } from 'orm'
import { DataSource, EntityManager } from 'typeorm'
import { config } from 'config'

const MAX_BLOCKS = 20 // DO NOT CHANGE THIS, hard limit is 20 in cometbft.

export abstract class Monitor {
  public syncedHeight: number
  public currentHeight: number
  protected db: DataSource
  protected isRunning = false

  constructor(
    public socket: RPCSocket,
    public rpcClient: RPCClient
  ) {}

  public async run(): Promise<void> {
    const state = await this.db.getRepository(StateEntity).findOne({
      where: {
        name: this.name(),
      },
    })

    if (!state) {
      await this.db
        .getRepository(StateEntity)
        .save({ name: this.name(), height: 0 })
    }

    this.syncedHeight = state?.height || 0

    this.socket.initialize()
    this.isRunning = true
    await this.monitor()
  }

  public stop(): void {
    this.socket.stop()
    this.isRunning = false
  }

  async handleBlockWithStateUpdate(manager: EntityManager): Promise<void> {
    await this.handleBlock(manager)
    if (this.syncedHeight % 10 === 0) {
      console.log(`${this.name()} height ${this.syncedHeight}`)
    }
    this.syncedHeight++
    await manager
      .getRepository(StateEntity)
      .update({ name: this.name() }, { height: this.syncedHeight })
  }

  public async monitor(): Promise<void> {
    while (this.isRunning) {
      try {
        const latestHeight = this.socket.latestHeight
        if (!latestHeight || !(latestHeight > this.syncedHeight)) continue
        const blockchainData = await this.rpcClient.getBlockchain(
          this.syncedHeight + 1,
          // cap the query to fetch 20 blocks at maximum
          // DO NOT CHANGE THIS, hard limit is 20 in cometbft.
          Math.min(latestHeight, this.syncedHeight + MAX_BLOCKS)
        )
        if (blockchainData === null) continue

        await this.db.transaction(async (manager: EntityManager) => {
          for (const metadata of blockchainData.block_metas.reverse()) {
            this.currentHeight = this.syncedHeight + 1

            if (this.currentHeight !== parseInt(metadata.header.height)) {
              throw new Error(
                `expected block meta is the height ${this.currentHeight}, but got ${metadata.header.height}`
              )
            }

            // if (parseInt(metadata.num_txs) > 0) {
            //   await this.handleTxs(manager)
            // }
            await this.handleBlockWithStateUpdate(manager)
          }
        })
      } catch (err) {
        console.log(`Error in ${this.name()} ${err}`)
      } finally {
        await Bluebird.delay(config.MONITOR_INTERVAL)
      }
    }
  }

  // eslint-disable-next-line
  public async handleBlock(manager: EntityManager): Promise<void> {}

  // eslint-disable-next-line
  public name(): string {
    return ''
  }
}
