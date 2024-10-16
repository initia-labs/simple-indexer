import { Event } from '@cosmjs/tendermint-rpc/build/comet38/responses'
import * as crypto from 'crypto'

export function getTxHash(tx: Uint8Array): string {
  const s256Buffer = crypto.createHash(`sha256`).update(tx).digest()
  const txbytes = new Uint8Array(s256Buffer)
  return Buffer.from(txbytes.slice(0, 32)).toString(`hex`).toUpperCase()
}

export function eventToEventWithInfo(
  event: Event,
  timestamp: string,
  txhash: string,
  height: number
): EventWithInfo {
  return {
    timestamp,
    txhash,
    height,
    type: event.type,
    attributes: event.attributes.map((attribute) => ({
      key: attribute.key,
      value: attribute.value,
    })),
  }
}

export interface EventWithInfo {
  txhash: string
  timestamp: string
  height: number
  type: string
  attributes: {
    key: string
    value: string
  }[]
}
