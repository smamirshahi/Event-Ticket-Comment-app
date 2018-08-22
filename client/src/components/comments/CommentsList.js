import React, { PureComponent } from 'react'
import { getComments, createComment } from '../../actions/comments'
import { getEvents } from '../../actions/events'
import { getUsers } from '../../actions/users'
import CreateComment from './CreateComment'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
// import Button from 'material-ui/Button'
import Paper from 'material-ui/Paper'
import Card, { /* CardActions,  */CardContent/* , CardMedia */ } from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import './CommentsList.css'

class CommentsList extends PureComponent {
    componentWillMount() {        
        if (this.props.authenticated) {
            if (this.props.events === null) this.props.getEvents()
            if (this.props.comments === null) this.props.getComments(this.props.match.params.id1, this.props.match.params.id2)
            // read data from server. componentWillMount only runs one time. It reads the current database and copy it to the React state. After that, any changes in the database will update in react and database together            
            if (this.props.users === null) this.props.getUsers()
        }
    }

    handleSubmit = (data) => {
        // this.props.history.push(`/events/${event.id}`)
		this.props.createComment(data.text, this.props.match.params.id1, this.props.match.params.id2)
	}

    renderEvent = (comment) => {
        const { /* users,  */history } = this.props
        // console.log("history", history)

        return (<Card key={comment.id} className="comment-card">
            <CardContent>
                <Typography variant="headline" component="h2">
                    {/* {comment.user_id} */}
                </Typography>
                <Typography component="p">
                    {comment.text}
                </Typography>
            </CardContent>
        </Card>)
    }

    render() {
        console.log("hello0")
        const { events, tickets, comments, users, authenticated/* , createEvent */ } = this.props
        // const { ticket } = tickets[this.props.match.params.id2]
        console.log(tickets)
        if (!authenticated) return (
            <Redirect to="/login" />
        )
        console.log("hello2")
        // if (comments === null && users === null) return null
        // if ( events === null ) return null
        console.log("hello3")
        return (<Paper className="outer-paper">
            <div>
                {/* {comments.map(comment => this.renderEvent(comment))} */}
            </div>

            <h2>Publish a new comment</h2>

            {!this.props.authenticated && <p>You need to login to create an event</p>}

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
    events: state.events,
    tickets: state.events && state.events[props.match.params.id1].tickets,
    // comments: state.events && state.events[props.match.params.id1].tickets[props.match.params.id2].comments
})

const mapDispatchToProps = {
    getEvents, getUsers, getComments, createComment
}

export default connect( mapStateToProps, mapDispatchToProps)(CommentsList)
