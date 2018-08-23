import {
  JsonController, Authorized, CurrentUser, Post, Param/* , BadRequestError */, HttpCode/* , NotFoundError, ForbiddenError */, Get,
  Body,
  BadRequestError,/* , Patch */
} from 'routing-controllers'
import User from '../users/entity'
// import { Game, Player, Board } from './entities'
import { Ticket } from './entity'
import { Event } from '../events/entity'
// import {IsBoard, isValidTransition, calculateWinner, finished} from './logic'
// import { Validate } from 'class-validator'
import { io } from '../index'

// class GameUpdate {

//   @Validate(IsBoard, {
//     message: 'Not a valid board'
//   })
//   board: Board
// }

@JsonController()
export default class TicketController {

  @Authorized()
  // @Post('/games')
  @Post('/events/:id([0-9]+)/tickets')
  @HttpCode(201)
  async createEvent(
    @CurrentUser() user: User,
    @Param('id') eventId: number,
    @Body() entity: Ticket
  ) {

    const event = await Event.findOneById(eventId)
    if (!event) throw new BadRequestError(`This event does not exist`)
    // const author = await User.findOneById(user.id)
    const author = user.firstName.concat(` ${user.lastName}`)

    const Ticket1 = await Ticket.create({
      author: author,
      picture: entity.picture,
      price: entity.price,
      description: entity.description,
      risk: 2,
      user,
      event
    }).save()

    const currentTicket = await Ticket.findOneById(Ticket1.id)

    // let ticketId = currentTicket.id
    let updatedRisk
    let authourRisk
    let totalRisk
    let averageRisk
    let commentRisk

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

    let allTickets = eventswithtickets[0].tickets
    // console.log(allTickets)
    let allPrice = (allTickets.map(singleTicket => singleTicket.price))

    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    let totalNumber = allPrice.reduce(reducer);
    let averagePrice = totalNumber / allPrice.length
    if (currentTicket !== undefined) {
      /* calculate the risk of the author */
      const sameAuthors = await Ticket.find({ where: { author: currentTicket.author } })
      authourRisk = 0
      if (sameAuthors.length === 1) authourRisk = 4

      /* calculate the risk of averaging */
      averageRisk = -((currentTicket.price - averagePrice) / averagePrice) * 100
      if (averageRisk < 0) averageRisk = Math.max(averageRisk, -15)

      /* calculate the risk of updated hour (9-17) */
      const updated = currentTicket.createdAt
      const updatedHour = Number(updated.toISOString().split("T")[1].split(":")[0])
      if (updatedHour >= 9 && updatedHour <= 17) updatedRisk = -13
      if (updatedHour < 9 || updatedHour > 17) updatedRisk = 13
      console.log("hello", currentTicket)
      /* calculate the risk of low comments */
      let numberOfComments = currentTicket.comments.length
      commentRisk = 0
      if (numberOfComments < 3) commentRisk = 6
      // console.log("and the comment risk is equal to", commentRisk)

      /* calculate the whole risk */
      totalRisk = authourRisk + updatedRisk + averageRisk + commentRisk

      


      totalRisk = authourRisk + updatedRisk + averageRisk
      if (totalRisk < 2) totalRisk = 2
      if (totalRisk > 98) totalRisk = 98
      console.log(`author Risk ${authourRisk}`)
      console.log(`updated Risk ${updatedRisk}`)
      console.log(`average Risk ${averageRisk}`)
      console.log(`and the total Risk is ${totalRisk}`)
      currentTicket.risk = Math.round(totalRisk)
      await currentTicket.save()
    }








    // const ticket = await Ticket.findOneById(ticket1.id)

    io.emit('action', {
      type: 'ADD_TICKET',
      payload: await Event.findOneById(event.id)
    })
    return currentTicket
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
  @Get('/events/:id([0-9]+)/tickets')
  getTickets(
    @Param('id') id: number
  ) {
    // console.log("the /events/:id([0-9]+) with get request is called in ticket controller")
    return Ticket.find({ where: { event_id: id } }) // find tickets with event_id equal to id
  }
}

