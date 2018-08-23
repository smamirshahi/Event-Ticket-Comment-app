import React, { PureComponent } from 'react'
import { getComments, createComment } from '../../actions/comments'
import { getTickets, getTicketRisk } from '../../actions/tickets'
import { getEvents } from '../../actions/events'
import { getUsers } from '../../actions/users'
import CreateComment from './CreateComment'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import Button from 'material-ui/Button'
import Paper from 'material-ui/Paper'
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import './CommentsList.css'

class CommentsList extends PureComponent {
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
        this.props.createComment(data.text, this.props.match.params.id1, this.props.match.params.id2)
    }

    renderComment = (comment) => {
        const { /* users,  */history } = this.props
        // console.log("history", history)

        return (<Card key={comment.id} className="ticket-card">
            <CardContent>
                <Typography variant="subheading" component="h2">
                    Commented by: {comment.author}
                </Typography>
                <Typography component="p">
                    {comment.text}
                </Typography>
            </CardContent>
        </Card>)
    }

    thisTicket = (element, index, array) => {
        // console.log(element.id + 1)
        // console.log(this.props.match.params.id2 + 1)
        if (element.id === Number(this.props.match.params.id2)) {
            return element
        }
    }




    render() {
        const { event, /* tickets,  */users, authenticated/* , createEvent */ } = this.props
        // console.log("tickets",this.props.tickets)
        if (!authenticated) return (
            <Redirect to="/login" />
        )

        if (event === null && users === null) return 'Loading ...'
        // if ( tickets === null ) return null
        // this.props.getTicketRisk(this.props.match.params.id1, this.props.match.params.id2)

        let allTickets
        let ticketIndex

        allTickets = event.tickets
        // console.log(allTickets)

        { ticketIndex = allTickets.findIndex(this.thisTicket) }
        // {console.log(event.tickets[ticketIndex].id)}
        // {console.log(event.tickets[0].id)}

        let currentTicket = event.tickets[ticketIndex]

        let riskClass
        if ((currentTicket.risk > 70)) {
            riskClass = "risky"
        } else if (currentTicket.risk > 30) {
            riskClass = "normalRisk"
        } else {
            riskClass = "safe"
        }


        return (<Paper className="outer-paper">
            <h1>Ticket Details: Publisher {currentTicket.author}</h1>
            <h2 className={riskClass}>Risk: {currentTicket.risk} %</h2>
            <h3>Ticket Picture: {currentTicket.picture}</h3>
            <h3>Price: {currentTicket.price}</h3>
            <h3>Description: {currentTicket.description}</h3>


            <div>
                {currentTicket.comments.map(comment => this.renderComment(comment))}
            </div>

            <h2>Create A New Comment</h2>

            {!this.props.authenticated && <p>You need to login to add a comment</p>}

            {this.props.authenticated && <div>

                <CreateComment onSubmit={this.handleSubmit} />
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
    getEvents, getUsers, getTickets, getTicketRisk, createComment
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentsList)
