import * as request from 'superagent'
import { baseUrl } from '../constants'
import { logout } from './users'
import { isExpired } from '../jwt'

export const ADD_COMMENT = 'ADD_COMMENT'
export const UPDATE_COMMENT = 'UPDATE_COMMENT'
export const UPDATE_COMMENTS = 'UPDATE_COMMENTS'
export const UPDATE_COMMENT_SUCCESS = 'UPDATE_COMMENT_SUCCESS'

const updateCommentSuccess = () => ({
  type: UPDATE_COMMENT_SUCCESS
})

export const getComments = (eventId, ticketId) => (dispatch, getState) => {
  // const state = getState()
  // if (!state.currentUser) return null
  // const jwt = state.currentUser.jwt
  // console.log("get tickets in actions is called")

  // if (isExpired(jwt)) return dispatch(logout())

  request
    .get(`${baseUrl}/events/${eventId}/tickets/${ticketId}`)
    // .set('Authorization', `Bearer ${jwt}`)
    .then(result => dispatch(updateCommentSuccess(result.body)))
    .catch(err => console.error(err))
}

export const createComment = (text, eventId, ticketId) => (dispatch, getState) => {
  const state = getState()
  const jwt = state.currentUser.jwt

  if (isExpired(jwt)) return dispatch(logout())
  // console.log(eventId)
  request
    .post(`${baseUrl}/events/${eventId}/tickets/${ticketId}`)
    .set('Authorization', `Bearer ${jwt}`)
    .send({ text })
    .then(result => dispatch(updateCommentSuccess(result.body)))
    .catch(err => console.error(err))
}
