import { Event, LCDClient, TxInfo } from '@initia/initia.js'
import { EntityManager, EntityTarget, ObjectLiteral } from 'typeorm'

class MonitorHelper {
  ///
  /// SAVE
  ///
  public async saveEntity<T extends ObjectLiteral>(
    manager: EntityManager,
    entityClass: EntityTarget<T>,
    entity: T
  ): Promise<T> {
    return await manager.getRepository(entityClass).save(entity)
  }

  ///
  ///  UTIL
  ///

  public async fetchEvents(
    lcd: LCDClient,
    height: number,
    eventType: string
  ): Promise<[boolean, any[]]> {
    const searchRes = await lcd.tx.search({
      query: [{ key: 'tx.height', value: height.toString() }],
    })

    const extractEvents = (txs: TxInfo[]) =>
      txs
        .filter((tx: TxInfo) => tx.events && tx.events.length > 0)
        .flatMap((tx: TxInfo) => tx.events ?? [])
        .filter((event: Event) => event.type === eventType)
    const isEmpty = searchRes.txs.length === 0
    const events = extractEvents(searchRes.txs)

    return [isEmpty, events]
  }

  public eventsToAttrMap(event: any): { [key: string]: string } {
    return event.attributes.reduce((obj, attr) => {
      obj[attr.key] = attr.value
      return obj
    }, {})
  }

  public parseData(attrMap: { [key: string]: string }): {
    [key: string]: string
  } {
    return JSON.parse(attrMap['data'])
  }
}

export default MonitorHelper
