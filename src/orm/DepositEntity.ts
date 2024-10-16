import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('deposit')
export class DepositEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  txhash: string

  @Column()
  storeAddr: string

  @Column()
  coinMetadata: string

  @Column({ type: 'bigint' })
  amount: string
}
