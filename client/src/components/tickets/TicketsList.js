import React, { PureComponent } from 'react'
import { getTickets, createTicket } from '../../actions/tickets'
import { getUsers } from '../../actions/users'
import CreateTicket from './CreateTicket'
import { connect } from 'react-redux'
// import { Redirect } from 'react-router-dom'
import Button from 'material-ui/Button'
import Paper from 'material-ui/Paper'
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import './TicketsList.css'

class TicketsList extends PureComponent {
    componentWillMount() {
        if (this.props.tickets === null) this.props.getTickets(1)
        if (this.props.authenticated) {
            // read data from server. componentWillMount only runs one time. It reads the current database and copy it to the React state. After that, any changes in the database will update in react and database together
            
            if (this.props.users === null) this.props.getUsers()
        }
    }

    handleSubmit = (data) => {
        // this.props.history.push(`/events/${event.id}`)
		this.props.createTicket(data.name, data.picture, data.price, data.description, 1)
	}

    renderTicket = (ticket) => {
        const { /* users,  */history } = this.props
        // console.log("history", history)

        return (<Card key={ticket.id} className="ticket-card">
            <CardContent>
                <Typography variant="headline" component="h2">
                    {ticket.name}
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
                    onClick={() => history.push(`/events/${ticket.eventNumber}/${ticket.id}`)}
                >
                    More Details for the ticket
        </Button>
            </CardActions>
        </Card>)
    }

    render() {
        const { tickets, users/* , authenticated, createEvent */ } = this.props

        // if (!authenticated) return (
        //     <Redirect to="/login" />
        // )

        if (tickets === null && users === null) return null
        // if ( tickets === null ) return null

        return (<Paper className="outer-paper">
            <div>
                {tickets.map(ticket => this.renderTicket(ticket))}
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

const mapStateToProps = state => ({
    authenticated: state.currentUser !== null,
    users: state.users === null ? null : state.users,
    tickets: state.tickets === null ?
        null : Object.values(state.tickets).sort((a, b) => b.id - a.id)
})

const mapDispatchToProps = {
    getTickets, getUsers, createTicket
}

export default connect(mapStateToProps, mapDispatchToProps)(TicketsList)
