import {ADD_COMMENT, UPDATE_COMMENT, UPDATE_COMMENTS} from '../actions/comments'
import {USER_LOGOUT} from '../actions/users'

export default (state = null, {type, payload}) => {
  switch (type) {
    case USER_LOGOUT:
      return null
    
    case ADD_COMMENT:
      return {
        ...state,
        [payload.id]: payload
      }

    case UPDATE_COMMENT:
      return {
        ...state,
        [payload.id]: payload
      }

    case UPDATE_COMMENTS:
      return payload.reduce((comments, comment) => {
        comments[comment.id] = comment
        return comments
      }, {})

    default:
      return state
  }
}
