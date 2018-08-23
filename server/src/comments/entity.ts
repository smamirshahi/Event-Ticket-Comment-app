import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, ManyToOne } from 'typeorm'
import User from '../users/entity'
import { Ticket } from '../tickets/entity'

@Entity()
export class Comment extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @Column('text', {nullable: false})
  author: string

  @Column('text', {nullable: false})
  text

  @ManyToOne(_ => User, user => user.comments)
  user: User

  @ManyToOne(_ => Ticket, ticket => ticket.comments)
  ticket: Ticket
}
