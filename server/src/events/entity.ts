import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, ManyToOne } from 'typeorm'
import User from '../users/entity'

// export type Symbol = 'x' | 'o'
// export type Row = [ Symbol | null, Symbol | null, Symbol | null ]
// export type Board = [ Row, Row, Row ]

// type Status = 'pending' | 'started' | 'finished'

// const emptyRow: Row = [null, null, null]
// const emptyBoard: Board = [ emptyRow, emptyRow, emptyRow ]

@Entity()
export class Event extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @Column('text', {nullable: true})
  title

  @Column('text', {nullable: true})
  description

  @Column('text', {nullable: true})
  picture

  @Column('text', {nullable: true})
  start

  @Column('text', {nullable: true})
  end

  @ManyToOne(_ => User, user => user.events)
  user: User

  // @OneToMany(_ => Ticket, ticket => ticket.event, {eager:true}) 
  // tickets: Ticket[]
}
