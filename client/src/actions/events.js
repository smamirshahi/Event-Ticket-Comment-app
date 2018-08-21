import * as request from 'superagent'
import {baseUrl} from '../constants'
import {logout} from './users'
import {isExpired} from '../jwt'

export const ADD_EVENT = 'ADD_EVENT'
export const UPDATE_EVENT = 'UPDATE_EVENT'
export const UPDATE_EVENTS = 'UPDATE_EVENTS'
// export const JOIN_GAME_SUCCESS = 'JOIN_GAME_SUCCESS'
// export const UPDATE_GAME_SUCCESS = 'UPDATE_GAME_SUCCESS'

const updateEvents = events => ({
  type: UPDATE_EVENTS,
  payload: events
})

const addEvent = event => ({
  type: ADD_EVENT,
  payload: event
})

// const updateGameSuccess = () => ({
//   type: UPDATE_GAME_SUCCESS
// })

// const joinGameSuccess = () => ({
//   type: JOIN_GAME_SUCCESS
// })


export const getEvents = () => (dispatch, getState) => {
  const state = getState()
  if (!state.currentUser) return null
  const jwt = state.currentUser.jwt

  if (isExpired(jwt)) return dispatch(logout())

  request
    .get(`${baseUrl}/events`)
    .set('Authorization', `Bearer ${jwt}`)
    .then(result => dispatch(updateEvents(result.body)))
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

export const createEvent = () => (dispatch, getState) => {
  const state = getState()
  const jwt = state.currentUser.jwt

  if (isExpired(jwt)) return dispatch(logout())

  request
    .post(`${baseUrl}/events`)
    .set('Authorization', `Bearer ${jwt}`)
    .then(result => dispatch(addEvent(result.body)))
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
