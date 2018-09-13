import {
  JsonController, Authorized, CurrentUser, Post, Param/* , BadRequestError */, HttpCode/* , NotFoundError, ForbiddenError */, Get,
  Body,/* , Patch */
} from 'routing-controllers'
import User from '../users/entity'
import { Comment } from './entity'
import { Event } from '../events/entity'
import { Ticket } from '../tickets/entity'
import { io } from '../index'

@JsonController()
export default class CommentController {

  @Authorized()
  @Post('/events/:id1([0-9]+)/tickets/:id2([0-9]+)') // .../comments
  @HttpCode(201)
  async createTicket(
    @CurrentUser() user: User,
    @Param('id1') eventId: number,
    @Param('id2') ticketId: number,
    @Body() entity: Comment
  ) {
    const ticket = await Ticket.findOneById(ticketId)
    const author = user.firstName.concat(` ${user.lastName}`)

    const comment1 = await Comment.create({
      author: author,
      text: entity.text,
      user,
      ticket
    }).save()

    io.emit('action', {
      type: 'ADD_COMMENT',
      payload: await Event.findOneById(eventId)
    })
    return comment1
  }

  // @Authorized()
  // @Get('/events/:id([0-9]+)')
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
    let commentRisk
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
      // console.log("comment length", currentTicket.comments.length)
      // console.log("important", currentTicket)

      /* calculate the risk of the author */
      const sameAuthors = await Ticket.find({ where: { author: currentTicket.author } })
      // console.log(`number of tickets with the same author: ${sameAuthors.length}`)
      authourRisk = 0
      if (sameAuthors.length === 1) authourRisk = 4
      // console.log(`The author risk is ${authourRisk}`)

      /* calculate the risk of averaging */
      averageRisk = -((currentTicket.price - averagePrice) / averagePrice) * 100
      // console.log(currentTicket.price)
      // console.log(averagePrice)
      if (averageRisk < 0) averageRisk = Math.max(averageRisk, -15)
      // console.log("average price is", averagePrice)


      /* calculate the risk of updated hour (9-17) */
      const updated = currentTicket.createdAt
      const updatedHour = Number(updated.toISOString().split("T")[1].split(":")[0]) + 2
      // console.log(`updated hour is ${Number(updatedHour)}`)
      if (updatedHour >= 9 && updatedHour <= 17) updatedRisk = -13
      if (updatedHour < 9 || updatedHour > 17) updatedRisk = 13

      /* calculate the risk of low comments */
      let numberOfComments = currentTicket.comments.length
      commentRisk = 0
      if (numberOfComments < 3) commentRisk = 6
      // console.log("and the comment risk is equal to", commentRisk)

      /* calculate the whole risk */
      totalRisk = authourRisk + updatedRisk + averageRisk + commentRisk
      console.log(`author: ${authourRisk} - update: ${updatedRisk} - average: ${averageRisk} - comment: ${commentRisk} - `)
      if (totalRisk < 2) totalRisk = 2
      if (totalRisk > 98) totalRisk = 98
      console.log(`and the total Risk is ${totalRisk}`)
      currentTicket.risk = Math.round(totalRisk)
      await currentTicket.save()


      io.emit('action', {
        type: 'UPDATE_COMMENTS',
        payload: await Event.findOneById(eventId)
      })

      return currentTicket
    }
  }
}

