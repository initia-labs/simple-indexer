import { Version } from '@cosmjs/tendermint-rpc/build/comet38'
import { Column, Entity, PrimaryColumn, Index } from 'typeorm'

@Entity('block')
export class BlockEntity {
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

  @Column({ type: 'jsonb', nullable: true })
  last_block_id: { hash: string; parts: { total: number; hash: string } } | null

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
