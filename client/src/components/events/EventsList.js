import React, {PureComponent} from 'react'
import {getEvents, createEvent} from '../../actions/events'
import {getUsers} from '../../actions/users'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import Button from 'material-ui/Button'
import Paper from 'material-ui/Paper'
import Card, { CardActions, CardContent } from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import './EventsList.css'

class EventsList extends PureComponent {
  componentWillMount() {
    if (this.props.authenticated) {
        // read data from server. componentWillMount only runs one time. It reads the current database and copy it to the React state. After that, any changes in the database will update in react and database together
      if (this.props.events === null) this.props.getEvents()
      if (this.props.users === null) this.props.getUsers()
    }
  }

  renderEvent = (event) => {
    const {users, history} = this.props

    return (<Card key={event.id} className="event-card">
      <CardContent>
        <Typography color="textSecondary">
          This event is created by 
          {/* played by&nbsp;
          {
            game.players
              .map(player => users[player.userId].firstName)
              .join(' and ')
          } */}
        </Typography>
        <Typography variant="headline" component="h2">
          Event: {event.title}
        </Typography>
        {/* <Typography color="textSecondary">
          Status: {game.status}
        </Typography> */}
      </CardContent>
      <CardActions>
        <Button
          size="small"
          onClick={() => history.push(`/events/${event.id}`)}
        >
          More Details
        </Button>
      </CardActions>
    </Card>)
  }

  render() {
    const {events, users, authenticated, createEvent} = this.props

    if (!authenticated) return (
			<Redirect to="/login" />
		)

    if (events === null || users === null) return null

    return (<Paper className="outer-paper">
      <Button
        color="primary"
        variant="raised"
        onClick={createEvent}
        className="create-event"
      >
        Create A New Event
      </Button>

      <div>
        {events.map(event => this.renderEvent(event))}
      </div>
    </Paper>)
  }
}

const mapStateToProps = state => ({
  authenticated: state.currentUser !== null,
  users: state.users === null ? null : state.users,
  events: state.events === null ?
    null : Object.values(state.events).sort((a, b) => b.id - a.id)
})

export default connect(mapStateToProps, {getEvents, getUsers, createEvent})(EventsList)
