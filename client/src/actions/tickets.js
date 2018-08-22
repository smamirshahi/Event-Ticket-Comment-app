import * as request from 'superagent'
import { baseUrl } from '../constants'
import { logout } from './users'
import { isExpired } from '../jwt'

export const ADD_TICKET = 'ADD_TICKET'
export const UPDATE_TICKET = 'UPDATE_TICKET'
export const UPDATE_TICKETS = 'UPDATE_TICKETS'
// export const JOIN_GAME_SUCCESS = 'JOIN_GAME_SUCCESS'
// export const UPDATE_GAME_SUCCESS = 'UPDATE_GAME_SUCCESS'

const updateTickets = tickets => ({
  type: UPDATE_TICKETS,
  payload: tickets
})

const addTicket = ticket => ({
  type: ADD_TICKET,
  payload: ticket
})

// const updateGameSuccess = () => ({
//   type: UPDATE_GAME_SUCCESS
// })

// const joinGameSuccess = () => ({
//   type: JOIN_GAME_SUCCESS
// })


export const getTickets = (eventId) => (dispatch, getState) => {
  const state = getState()
  if (!state.currentUser) return null
  const jwt = state.currentUser.jwt
  // console.log("get tickets in actions is called")

  if (isExpired(jwt)) return dispatch(logout())

  request
    .get(`${baseUrl}/events/${eventId}/tickets`)
    .set('Authorization', `Bearer ${jwt}`)
    .then(result => dispatch(updateTickets(result.body)))
    .catch(err => console.error(err))
}

// export const joinGame = (gameId) => (dispatch, getState) => {
//   const state = getState()
//   const jwt = state.currentUser.jwt

//   if (isExpired(jwt)) return dispatch(logout())

//   request
//     .post(`${baseUrl}/games/${gameId}/players`)
//     .set('Authorization', `Bearer ${jwt}`)
//     .then(_ => dispatch(joinGameSuccess()))
//     .catch(err => console.error(err))
// }

export const createTicket = (name, picture, price, description, eventId) => (dispatch, getState) => {
  const state = getState()
  const jwt = state.currentUser.jwt

  if (isExpired(jwt)) return dispatch(logout())
  // console.log(eventId)
  request
    .post(`${baseUrl}/events/${eventId}/tickets`)
    .set('Authorization', `Bearer ${jwt}`)
    .send({ name, picture, price, description })
    .then(result => dispatch(addTicket(result.body)))
    .catch(err => console.error(err))
}

// export const updateGame = (gameId, board) => (dispatch, getState) => {
//   const state = getState()
//   const jwt = state.currentUser.jwt

//   if (isExpired(jwt)) return dispatch(logout())

//   request
//     .patch(`${baseUrl}/games/${gameId}`)
//     .set('Authorization', `Bearer ${jwt}`)
//     .send({ board })
//     .then(_ => dispatch(updateGameSuccess()))
//     .catch(err => console.error(err))
// }
