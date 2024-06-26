import { finalizeORM } from 'orm'
import { Collector } from './Collector'
import { RPCClient, RPCSocket } from 'lib/rpc'
import { config } from 'config'

let collectors: Collector[] = []

export async function runBot(): Promise<void> {
  collectors = [
    new Collector(
      new RPCSocket(config.RPC_URL, 10_000),
      new RPCClient(config.RPC_URL)
    ),
  ]

  try {
    await Promise.all(
      collectors.map((bot) => {
        bot.run()
      })
    )
  } catch (err) {
    console.log(err)
    stopCollectors()
  }
}

export async function stopCollectors(): Promise<void> {
  collectors.forEach((bot) => bot.stop())
  console.log('Closing DB connection')
  await finalizeORM()
}
