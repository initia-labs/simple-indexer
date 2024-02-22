import { Column, Entity, PrimaryColumn, Index } from 'typeorm'

@Entity('lunch_task')
export class LunchTaskEntity {
  @PrimaryColumn()
  account: string

  @PrimaryColumn()
  task_name: string

  @PrimaryColumn()
  task_tx_hash: string

  @Column({ type: 'timestamptz' })
  @Index('lunch_task_timestamp')
  timestamp: Date
}
