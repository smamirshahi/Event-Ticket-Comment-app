import {
  JsonController, Authorized, CurrentUser, Post, Param/* , BadRequestError */, HttpCode/* , NotFoundError, ForbiddenError */, Get,
  Body,/* , Patch */
} from 'routing-controllers'
import User from '../users/entity'
// import { Game, Player, Board } from './entities'
import { Comment } from './entity'
  import { Event } from '../events/entity'
import { Ticket } from '../tickets/entity'
// import {IsBoard, isValidTransition, calculateWinner, finished} from './logic'
// import { Validate } from 'class-validator'
import { io } from '../index'
// import { getRepository } from 'typeorm';

// class GameUpdate {

//   @Validate(IsBoard, {
//     message: 'Not a valid board'
//   })
//   board: Board
// }

@JsonController()
export default class GameController {

  @Authorized()
  // @Post('/games')
  @Post('/events/:id1([0-9]+)/tickets/:id2([0-9]+)')
  @HttpCode(201)
  async createTicket(
    @CurrentUser() user: User,
    //   @Param('id1') eventId: number,
    @Param('id2') ticketId: number,
    @Body() entity: Comment
  ) {
    //   const event = await Event.findOneById(eventId)
    const ticket = await Ticket.findOneById(ticketId)
    const author = user.firstName.concat(` ${user.lastName}`)

    const comment1 = await Comment.create({
      author: author,
      text: entity.text,
      user,
      ticket
    }).save()

    const comment = await Comment.findOneById(comment1.id)

    io.emit('action', {
      type: 'ADD_COMMENT',
      payload: comment
    })
    return comment
  }

  // @Authorized()
  // @Post('/games/:id([0-9]+)/players')
  // @HttpCode(201)
  // async joinGame(
  //   @CurrentUser() user: User,
  //   @Param('id') gameId: number
  // ) {
  //   const game = await Game.findOneById(gameId)
  //   if (!game) throw new BadRequestError(`Game does not exist`)
  //   if (game.status !== 'pending') throw new BadRequestError(`Game is already started`)

  //   game.status = 'started'
  //   await game.save()

  //   const player = await Player.create({
  //     game, 
  //     user,
  //     symbol: 'o'
  //   }).save()

  //   io.emit('action', {
  //     type: 'UPDATE_GAME',
  //     payload: await Game.findOneById(game.id)
  //   })

  //   return player
  // }

  // @Authorized()
  // // the reason that we're using patch here is because this request is not idempotent
  // // http://restcookbook.com/HTTP%20Methods/idempotency/
  // // try to fire the same requests twice, see what happens
  // @Patch('/games/:id([0-9]+)')
  // async updateGame(
  //   @CurrentUser() user: User,
  //   @Param('id') gameId: number,
  //   @Body() update: GameUpdate
  // ) {
  //   const game = await Game.findOneById(gameId)
  //   if (!game) throw new NotFoundError(`Game does not exist`)

  //   const player = await Player.findOne({ user, game })

  //   if (!player) throw new ForbiddenError(`You are not part of this game`)
  //   if (game.status !== 'started') throw new BadRequestError(`The game is not started yet`)
  //   if (player.symbol !== game.turn) throw new BadRequestError(`It's not your turn`)
  //   if (!isValidTransition(player.symbol, game.board, update.board)) {
  //     throw new BadRequestError(`Invalid move`)
  //   }    

  //   const winner = calculateWinner(update.board)
  //   if (winner) {
  //     game.winner = winner
  //     game.status = 'finished'
  //   }
  //   else if (finished(update.board)) {
  //     game.status = 'finished'
  //   }
  //   else {
  //     game.turn = player.symbol === 'x' ? 'o' : 'x'
  //   }
  //   game.board = update.board
  //   await game.save()

  //   io.emit('action', {
  //     type: 'UPDATE_GAME',
  //     payload: game
  //   })

  //   return game
  // }

  // @Authorized()
  // @Get('/events/:id([0-9]+)')
  // // getGame(
  // getEvent(
  //   @Param('id') id: number
  // ) {
  //   return Event.findOneById(id)
  // }

  // @Authorized()
  @Get('/events/:id1([0-9]+)/tickets/:id2([0-9]+)')
  async getComments(
    @Param('id1') eventId: number,
    @Param('id2') ticketId: number,
  ) {
    let updatedRisk
    let authourRisk
    let totalRisk
    let averageRisk
    console.log("hello")
    const currentTicket = await Ticket.findOneById(ticketId)
    
    const currentEvent = await Event.findOneById(eventId)
    if (currentEvent !== undefined) {
    // console.log(currentEvent.id)
    }

    // const manytickets = await Event.find({where: {id: eventId}/* , relations: ["currentTicket"] } */)
    // console.log(`manytickets ${manytickets.length}`)

    const eventswithtickets = await Event.find({
      where: {
        id: eventId
      },
      join: {
        alias: "event",
        leftJoinAndSelect: {
          "tickets": "event.tickets"
        }
      }
    })
    // console.log("1", eventswithtickets[0].tickets)

    let allTickets = eventswithtickets[0].tickets
    // console.log(allTickets[2].price)

    let allPrice = (allTickets.map(singleTicket => singleTicket.price))

    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    let totalNumber = allPrice.reduce(reducer);
    let averagePrice = totalNumber / allPrice.length
    
    // console.log(averageNumber)



    // const userRepository = getRepository(Ticket)
    // console.log(await userRepository.find({ select: ["title"]}))
    // console.log(await userRepository.find({ relations: ["event"]}))

    if (currentTicket !== undefined) {
      // console.log("important", currentTicket)

      /* calculate the risk of the author */
      const sameAuthors = await Ticket.find({ where: { author: currentTicket.author } })
      // console.log(`number of tickets with the same author: ${sameAuthors.length}`)
      authourRisk = 0
      if (sameAuthors.length === 1) authourRisk = 4
      // console.log(`The author risk is ${authourRisk}`)

      // calculate the risk of averaging
      averageRisk = -((currentTicket.price - averagePrice) / averagePrice)*100
      // console.log(currentTicket.price)
      // console.log(averagePrice)
      if (averageRisk < 0) averageRisk=Math.max(averageRisk, -15)
      // console.log("averageRisk is", averageRisk)
      

      /* calculate the risk of updated hour (9-17) */
      const updated = currentTicket.createdAt
      const updatedHour = Number(updated.toISOString().split("T")[1].split(":")[0])
      // console.log(`updated hour is ${Number(updatedHour)}`)
      if (updatedHour >= 9 && updatedHour <= 17) updatedRisk = -13
      if (updatedHour < 9 || updatedHour > 17) updatedRisk = 13
      // console.log(`The updated risk is ${updatedRisk}`)

      totalRisk = authourRisk + updatedRisk + averageRisk
      if (totalRisk < 2) totalRisk = 2
      if (totalRisk > 98) totalRisk = 98
      console.log(`and the total Risk is ${totalRisk}`)
      currentTicket.risk = Math.round(totalRisk)
      await currentTicket.save()
      return currentTicket
    }



    // let ticket1 : Ticket[]
    // if (currentTicket !== undefined) {
    //   currentTicket({user})
    //   console.log(currentTicket.{user_id})
    // ticket1 = await Ticket.find({where: { user_id: currentTicket.user}})
    // console.log(ticket1.length)
  }

  // return ticket1



  // console.log("the /events/:id([0-9]+) with get request is called in ticket controller")
  // return Comment.find({where: { ticket_id: ticketId}}) // find tickets with event_id equal to id
}

