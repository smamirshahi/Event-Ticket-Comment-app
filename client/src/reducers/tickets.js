import {ADD_TICKET, UPDATE_TICKET, UPDATE_TICKETS} from '../actions/tickets'
import {USER_LOGOUT} from '../actions/users'

export default (state = null, {type, payload}) => {
  switch (type) {
    case USER_LOGOUT:
      return null
    
    case ADD_TICKET:
      return {
        ...state,
        [payload.id]: payload
      }

    case UPDATE_TICKET:
      return {
        ...state,
        [payload.id]: payload
      }

    case UPDATE_TICKETS:
      return payload.reduce((tickets, ticket) => {
        tickets[ticket.id] = ticket
        return tickets
      }, {})

    default:
      return state
  }
}
