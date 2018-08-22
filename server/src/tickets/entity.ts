import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, ManyToOne, OneToMany, UpdateDateColumn } from 'typeorm'
import User from '../users/entity'
import { Event } from '../events/entity'
import { Comment } from '../comments/entity'

// export type Symbol = 'x' | 'o'
// export type Row = [ Symbol | null, Symbol | null, Symbol | null ]
// export type Board = [ Row, Row, Row ]

// type Status = 'pending' | 'started' | 'finished'

// const emptyRow: Row = [null, null, null]
// const emptyBoard: Board = [ emptyRow, emptyRow, emptyRow ]

@Entity()
export class Ticket extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number
  
  // @Column('int', {nullable: true})
  // eventNumber
  
  @Column('text', {nullable: false})
  author: string
  
  @Column('text', {nullable: true})
  picture

  @Column('int', {nullable: false})
  price
  
  @Column('text', {nullable: false})
  description

  @Column('int', {nullable: true})
  risk
  
  @UpdateDateColumn({ name: 'updated_at', nullable: false })
  updatedAt: Date

  @ManyToOne(_ => User, user => user.tickets)
  user: User

  @ManyToOne(_ => Event, event => event.tickets)
  event: Event

  @OneToMany(_ => Comment, comment => comment.ticket, {eager:true}) 
  comments: Comment[]
}
