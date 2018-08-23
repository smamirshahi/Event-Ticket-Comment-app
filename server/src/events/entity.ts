import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, ManyToOne, OneToMany } from 'typeorm'
import User from '../users/entity'
import { Ticket } from '../tickets/entity'

@Entity()
export class Event extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @Column('text', {nullable: false})
  author: string

  @Column('text', {nullable: false})
  title

  @Column('text', {nullable: false})
  description

  @Column('text', {nullable: false})
  picture

  @Column('date', {nullable: false})
  start

  @Column('date', {nullable: false})
  end

  @ManyToOne(_ => User, user => user.events)
  user: User

  @OneToMany(_ => Ticket, ticket => ticket.event, {eager:true}) 
  tickets: Ticket[]
}
