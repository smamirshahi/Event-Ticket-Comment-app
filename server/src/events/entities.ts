import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, /* Index, OneToMany, */ ManyToOne } from 'typeorm'
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

  @Column('text', {nullable: false})
  name

  @Column('text', {nullable: false})
  description

  @Column('text', {nullable: false})
  picture

  @Column('text', {nullable: false})
  start

  @Column('text', {nullable: false})
  end

  // @ManyToOne(_ => User, user => user.events)
  // user: User

}
