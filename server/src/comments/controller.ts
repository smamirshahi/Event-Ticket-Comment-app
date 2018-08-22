import { 
    JsonController, Authorized, CurrentUser, Post, Param/* , BadRequestError */, HttpCode/* , NotFoundError, ForbiddenError */, Get, 
    Body,/* , Patch */ 
  } from 'routing-controllers'
  import User from '../users/entity'
  // import { Game, Player, Board } from './entities'
  import { Comment } from './entity'
//   import { Event } from '../events/entity'
  import { Ticket } from '../tickets/entity'
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
  
      const comment1 = await Comment.create({
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
    getComments(
    //   @Param('id1') eventId: number,
      @Param('id2') ticketId: number,
    ) {
      // console.log("the /events/:id([0-9]+) with get request is called in ticket controller")
      return Comment.find({where: { ticket_id: ticketId}}) // find tickets with event_id equal to id
    }
  }
  
  