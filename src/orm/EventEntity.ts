import { Column, Entity, Index, PrimaryColumn, ManyToOne } from 'typeorm'
import { TxEntity } from './TxEntity'

@Entity('event')
export class EventEntity {
  @PrimaryColumn()
  txhash: string

  @PrimaryColumn('int')
  index: number

  @Column('text')
  @Index('event_type_tag')
  type_tag: string

  @Column({ type: 'jsonb' })
  attributes: { [key: string]: string }

  @ManyToOne(() => TxEntity)
  tx: TxEntity
}
