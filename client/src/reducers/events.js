import {ADD_EVENT, UPDATE_EVENT, UPDATE_EVENTS} from '../actions/events'
import {ADD_TICKET, UPDATE_TICKET, UPDATE_TICKETS} from '../actions/tickets'
import {USER_LOGOUT} from '../actions/users'

export default (state = null, {type, payload}) => {
  switch (type) {
    case USER_LOGOUT:
      return null
    
    case ADD_EVENT:
    console.log("Add event reducer-state", state)
    console.log("Add event reducer-payload", payload)
      return {
        ...state,
        [payload.id]: payload
      }

    case UPDATE_EVENT:
      return {
        ...state,
        [payload.id]: payload
      }

    case UPDATE_EVENTS:
    console.log("update events reducer-state", state)
      return payload.reduce((events, event) => {
        events[event.id] = event
        return events
      }, {})

      case ADD_TICKET:
      console.log("i am state", state)
      console.log("i am payload", payload)
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
