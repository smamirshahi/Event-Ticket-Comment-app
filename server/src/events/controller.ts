import { 
  JsonController, Authorized, CurrentUser, Post, Param/* , BadRequestError */, HttpCode/* , NotFoundError, ForbiddenError */, Get, 
  Body,/* , Patch */ 
} from 'routing-controllers'
import User from '../users/entity'
// import { Game, Player, Board } from './entities'
import { Event } from './entity'
// import {IsBoard, isValidTransition, calculateWinner, finished} from './logic'
// import { Validate } from 'class-validator'
import {io} from '../index'

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
  @Post('/events')
  @HttpCode(201)
  async createEvent(
    @CurrentUser() user: User,
    @Body() entity: Event
  ) {
    // const event1 = await Event.create().save()
    const author = user.firstName.concat(` ${user.lastName}`)

    const event1 = await Event.create({
      author: author,
      title: entity.title,
      description: entity.description,
      picture: entity.picture,
      start: entity.start,
      end: entity.end,
      user,
    }).save()

    const event = await Event.findOneById(event1.id)

    io.emit('action', {
      type: 'ADD_EVENT',
      payload: event
    })

    return event
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

  @Authorized()
  @Get('/events/:id([0-9]+)')
  // getGame(
  getEvent(
    @Param('id') id: number
  ) {
    return Event.findOneById(id)
  }

  @Authorized()
  @Get('/events')
  async getGames() {
    const allEvent = await Event.find()
    // console.log("the get method is called")
    return allEvent
    // return Event.find()
  }
}

