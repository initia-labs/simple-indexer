import { BlockID, Version } from '@initia/initia.js'
import { Column, Entity, PrimaryColumn, Index } from 'typeorm'

@Entity('block')
export class BlockEntity {
  @PrimaryColumn()
  chain_id: string

  @PrimaryColumn({ type: 'bigint' })
  height: number

  @Column({ type: 'jsonb' })
  version: Version

  @Column()
  @Index('block_hash')
  hash: string

  @Column({ type: 'timestamptz' })
  @Index('block_time')
  time: Date

  @Column({ type: 'jsonb' })
  last_block_id: BlockID

  @Column()
  last_commit_hash: string

  @Column()
  data_hash: string

  @Column()
  validators_hash: string

  @Column()
  next_validators_hash: string

  @Column()
  consensus_hash: string

  @Column()
  app_hash: string

  @Column()
  last_results_hash: string

  @Column()
  evidence_hash: string

  @Column()
  proposer_address: string
}
