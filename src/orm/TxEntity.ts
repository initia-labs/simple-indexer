import { Event, Tx, TxLog } from '@initia/initia.js'
import { Column, Entity, Index, PrimaryColumn } from 'typeorm'

@Entity('tx')
export class TxEntity {
  @PrimaryColumn()
  txhash: string

  @Column()
  @Index('tx_height')
  height: number

  @Column()
  raw_log: string

  @Column({ type: 'simple-json', nullable: true })
  logs: TxLog[] | null

  @Column()
  gas_wanted: number

  @Column()
  gas_used: number

  @Column({ type: 'simple-json' })
  tx: Tx

  @Column()
  timestamp: string

  @Column({ type: 'simple-json' })
  events: Event[]

  @Column({ type: 'int', nullable: true })
  code: number | null

  @Column({ type: 'text', nullable: true })
  codespace: string | null
}
