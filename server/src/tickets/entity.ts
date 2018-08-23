import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, ManyToOne, OneToMany/* , UpdateDateColumn */, JoinColumn, CreateDateColumn } from 'typeorm'
import User from '../users/entity'
import { Event } from '../events/entity'
import { Comment } from '../comments/entity'

@Entity()
export class Ticket extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number
  
  @Column('text', {nullable: false})
  author: string
  
  @Column('text', {nullable: true})
  picture

  @Column('int', {nullable: false})
  price
  
  @Column('text', {nullable: false})
  description

  @Column('int', {nullable: true})
  risk: number
  
  @CreateDateColumn({ type: 'timestamp with time zone' ,precision: 6, default: () => "CURRENT_TIMESTAMP", nullable: false })
  createdAt: Date

  @ManyToOne(_ => User, user => user.tickets)
  user: User

  @ManyToOne(_ => Event, event => event.tickets)
  @JoinColumn({ name: "eventId"})
  event: Event

  @OneToMany(_ => Comment, comment => comment.ticket, {eager:true}) 
  comments: Comment[]
}
