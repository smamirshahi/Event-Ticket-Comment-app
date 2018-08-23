import React, { PureComponent } from 'react'
import { getTickets, createTicket } from '../../actions/tickets'
import { getEvents } from '../../actions/events'
import { getUsers } from '../../actions/users'
import CreateTicket from './CreateTicket'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import Button from 'material-ui/Button'
import Paper from 'material-ui/Paper'
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import './TicketsList.css'

class TicketsList extends PureComponent {
    componentWillMount() {

        if (this.props.authenticated) {
            if (this.props.event === null) this.props.getEvents()
            // if (this.props.tickets === null) this.props.getTickets(this.props.match.params.id1)
            // read data from server. componentWillMount only runs one time. It reads the current database and copy it to the React state. After that, any changes in the database will update in react and database together            
            if (this.props.users === null) this.props.getUsers()
        }
    }

    handleSubmit = (data) => {
        // this.props.history.push(`/events/${event.id1}`)
        this.props.createTicket(data.picture, data.price, data.description, this.props.match.params.id1)
    }

    renderTicket = (ticket) => {
        const { /* users,  */history } = this.props
        // console.log("history", history)
        let riskClass
        if (ticket.risk > 70) riskClass = "risky"
        else if (ticket.risk > 30) riskClass = "normalRisk"
        else riskClass = "safe"


        return (<Card key={ticket.id} className="ticket-card">
            <CardContent>
                <Typography variant="subheading" component="h2">
                    <p className={riskClass}>Created by: {ticket.author}</p>
                    <p>Risk: {ticket.risk}</p>
                </Typography>
                <CardMedia
                    className="ticket-media"
                    title={ticket.name}
                    style={{ height: 100 }}
                    image={ticket.picture}
                />
                <Typography component="p">
                    {ticket.description}
                </Typography>
            </CardContent>
            <CardContent className="textss">
                <p>{ticket.price}</p>
                <p>{ticket.risk}</p>
            </CardContent>
            <CardActions>
                <Button
                    size="small"
                    onClick={() => history.push(`/events/${this.props.match.params.id1}/tickets/${ticket.id}`)}
                >
                    More Details for the ticket
        </Button>
            </CardActions>
        </Card>)
    }

    render() {
        const { event, /* tickets,  */users, authenticated/* , createEvent */ } = this.props
        // console.log("tickets",this.props.tickets)
        if (!authenticated) return (
            <Redirect to="/login" />
        )

        if (event === null && users === null) return 'Loading ...'
        // if ( tickets === null ) return null

        return (<Paper className="outer-paper">
        <h1>Event: {event.title}</h1>
            <div>
                {event.tickets.map(ticket => this.renderTicket(ticket))}
            </div>

            <h2>Create A New Ticket</h2>

            {!this.props.authenticated && <p>You need to login to create a ticket</p>}

            {this.props.authenticated && <div>

                <CreateTicket onSubmit={this.handleSubmit} />
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

const mapStateToProps = (state, props) => ({
    authenticated: state.currentUser !== null,
    users: state.users === null ? null : state.users,
    event: state.events && state.events[props.match.params.id1],
    // tickets: state.events && state.events[props.match.params.id1].tickets
})

const mapDispatchToProps = {
    getEvents, getUsers, getTickets, createTicket
}

export default connect(mapStateToProps, mapDispatchToProps)(TicketsList)
