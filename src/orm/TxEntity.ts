import { Tx } from '@initia/initia.js'
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

  @Column({ type: 'jsonb' })
  tx: Tx

  @Column({ type: 'timestamptz' })
  timestamp: Date

  @Column({ type: 'int', nullable: true })
  code?: number

  @Column({ type: 'text', nullable: true })
  codespace?: string
}
