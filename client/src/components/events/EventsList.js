import React, { PureComponent } from 'react'
import { getEvents, createEvent } from '../../actions/events'
import { getUsers } from '../../actions/users'
import CreateEvent from './CreateEvent'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import Button from 'material-ui/Button'
import Paper from 'material-ui/Paper'
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card'
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

    handleSubmit = (data) => {
        // this.props.history.push(`/events/${event.id}`)
		this.props.createEvent(data.title, data.description, data.picture, data.start, data.end)
	}

    renderEvent = (event) => {
        const { /* users,  */history } = this.props
        // console.log("history", history)

        return (<Card key={event.id} className="event-card">
            <CardContent>
                <Typography variant="headline" component="h2">
                    {event.title}
                </Typography>
                <CardMedia
                    className="event-media"
                    title={event.title}
                    style={{ height: 100 }}
                    image={event.picture}
                />
                <Typography component="p">
                    {event.description}
                </Typography>
            </CardContent>
            <CardContent className="textss">
                <p>{event.start}</p>
                <p>{event.end}</p>
            </CardContent>
            <CardActions>
                <Button
                    size="small"
                    onClick={() => history.push(`/events/${event.id}/tickets`)}
                >
                    Buy Tickets
        </Button>
            </CardActions>
        </Card>)
    }

    render() {
        const { events, users, authenticated/* , createEvent */ } = this.props

        if (!authenticated) return (
            <Redirect to="/login" />
        )

        if (events === null && users === null) return null
        // if ( events === null ) return null

        return (<Paper className="outer-paper">
            <div>
                {events.map(event => this.renderEvent(event))}
            </div>

            <h2>Create A New Event</h2>

            {!this.props.authenticated && <p>You need to login to create an event</p>}

            {this.props.authenticated && <div>            

            <CreateEvent onSubmit={this.handleSubmit} />
            </div>}

            {/* <Button disabled={!this.props.authenticated}
                color="primary"
                variant="raised"
                // onClick={createEvent}
                onClick={() => <CreateEvent />}
                className="create-event"
            >
                Create A New Event
      </Button> */}
        </Paper>)
    }
}

const mapStateToProps = state => ({
    authenticated: state.currentUser !== null,
    users: state.users === null ? null : state.users,
    events: state.events === null ?
        null : Object.values(state.events).sort((a, b) => b.id - a.id)
})

const mapDispatchToProps = {
    getEvents, getUsers, createEvent
}

export default connect(mapStateToProps, mapDispatchToProps)(EventsList)
