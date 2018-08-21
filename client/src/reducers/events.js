import {ADD_EVENT, UPDATE_EVENT, UPDATE_EVENTS} from '../actions/events'
import {USER_LOGOUT} from '../actions/users'

export default (state = null, {type, payload}) => {
  switch (type) {
    case USER_LOGOUT:
      return null
    
    case ADD_EVENT:
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
      return payload.reduce((events, event) => {
        events[event.id] = event
        return events
      }, {})

    default:
      return state
  }
}
