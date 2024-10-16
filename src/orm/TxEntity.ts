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

  @Column()
  gas_wanted: number

  @Column()
  gas_used: number

  @Column()
  tx: string // base64 encdoed

  @Column({ type: 'timestamptz' })
  timestamp: Date

  @Column({ type: 'int' })
  code: number
}
