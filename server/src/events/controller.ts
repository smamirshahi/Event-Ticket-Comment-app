import {
  JsonController, Authorized, CurrentUser, Post, Param/* , BadRequestError */, HttpCode/* , NotFoundError, ForbiddenError */, Get,
  Body,/* , Patch */
} from 'routing-controllers'
import User from '../users/entity'
import { Event } from './entity'
import { io } from '../index'

@JsonController()
export default class EventController {

  @Authorized()
  @Post('/events')
  @HttpCode(201)
  async createEvent(
    @CurrentUser() user: User,
    @Body() entity: Event
  ) {
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

  @Authorized()
  @Get('/events/:id([0-9]+)')
  getEvent(
    @Param('id') id: number
  ) {
    return Event.findOneById(id)
  }

  // @Authorized()
  @Get('/events')
  async getEvents() {
    const allEvent = await Event.find()
    // console.log("the get method is called")
    return allEvent
    // return Event.find()
  }
}

