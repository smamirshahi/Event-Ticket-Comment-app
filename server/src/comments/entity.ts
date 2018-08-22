import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, ManyToOne } from 'typeorm'
import User from '../users/entity'
import { Ticket } from '../tickets/entity'

// export type Symbol = 'x' | 'o'
// export type Row = [ Symbol | null, Symbol | null, Symbol | null ]
// export type Board = [ Row, Row, Row ]

// type Status = 'pending' | 'started' | 'finished'

// const emptyRow: Row = [null, null, null]
// const emptyBoard: Board = [ emptyRow, emptyRow, emptyRow ]

@Entity()
export class Comment extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @Column('text', {nullable: false})
  text

  @ManyToOne(_ => User, user => user.comments)
  user: User

  @ManyToOne(_ => Ticket, ticket => ticket.comments)
  ticket: Ticket
}
