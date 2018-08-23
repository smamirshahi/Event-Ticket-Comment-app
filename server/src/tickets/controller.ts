import {
  JsonController, Authorized, CurrentUser, Post, Param/* , BadRequestError */, HttpCode/* , NotFoundError, ForbiddenError */, Get,
  Body,
  BadRequestError,/* , Patch */
} from 'routing-controllers'
import User from '../users/entity'
import { Ticket } from './entity'
import { Event } from '../events/entity'
import { io } from '../index'

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
      const updatedHour = Number(updated.toISOString().split("T")[1].split(":")[0]) + 2
      if (updatedHour >= 9 && updatedHour <= 17) updatedRisk = -13
      if (updatedHour < 9 || updatedHour > 17) updatedRisk = 13
      // console.log(currentTicket)
      /* calculate the risk of low comments */
      let numberOfComments = currentTicket.comments.length
      commentRisk = 0
      if (numberOfComments < 3) commentRisk = 6
      // console.log("and the comment risk is equal to", commentRisk)

      /* calculate the whole risk */
      totalRisk = authourRisk + updatedRisk + averageRisk + commentRisk

      if (totalRisk < 2) totalRisk = 2
      if (totalRisk > 98) totalRisk = 98
      // console.log(`and the total Risk is ${totalRisk}`)
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
  @Get('/events/:id([0-9]+)/tickets')
  getTickets(
    @Param('id') id: number
  ) {
    // console.log("the /events/:id([0-9]+) with get request is called in ticket controller")
    return Ticket.find({ where: { event_id: id } }) // find tickets with event_id equal to id
  }
}

