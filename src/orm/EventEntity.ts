import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Entity('event')
export class EventEntity {
  @PrimaryGeneratedColumn()
  id?: number

  @Column('text')
  @Index('event_type_tag')
  type_tag: string

  @Column('text')
  data: string
}
