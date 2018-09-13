import React, { PureComponent } from 'react'
import PropTypes from 'prop-types';
import { getComments, createComment } from '../../actions/comments'
import { getTickets, getTicketRisk } from '../../actions/tickets'
import { getEvents } from '../../actions/events'
import { getUsers } from '../../actions/users'
import CreateComment from './CreateComment'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles';
// import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
// import Collapse from '@material-ui/core/Collapse';
// import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import Button from 'material-ui/Button'
import Paper from 'material-ui/Paper'
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import './CommentsList.css'
import compose from 'recompose/compose';

const styles = theme => ({
    card: {
        maxWidth: 400,
        margin: 50,
        borderStyle: 'dashed',
    },
    risky: {
        color: 'red'
    },
    normalRisk: {
        color: 'orange'
    },
    safe: {
        color: 'green'
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    actions: {
        display: 'flex',
    },
    expand: {
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
        marginLeft: 'auto',
        [theme.breakpoints.up('sm')]: {
            marginRight: -8,
        },
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
});

class CommentsList extends PureComponent {
    componentWillMount() {
        if (this.props.event === null) this.props.getEvents()
        if (this.props.authenticated) {
            // if (this.props.tickets === null) this.props.getTickets(this.props.match.params.id1)
            // read data from server. componentWillMount only runs one time. It reads the current database and copy it to the React state. After that, any changes in the database will update in react and database together            
            if (this.props.users === null) this.props.getUsers()
        }
    }

    handleSubmit = (data) => {
        this.props.createComment(data.text, this.props.match.params.id1, this.props.match.params.id2)
    }

    renderComment = (comment, classes) => {
        // const { /* users,  *//* history */ } = this.props
        return (<Card key={comment.id} className={`${classes.card}`}>
            <CardHeader
                subheader={`${comment.author}`}
            />
            <CardContent>
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
        const { event, /* tickets,  */users, classes /* authenticated *//* , createEvent */ } = this.props
        // console.log("tickets",this.props.tickets)
        // if (!authenticated) return (
        //     <Redirect to="/login" />
        // )

        if (event === null && users === null) return 'Loading ...'
        let allTickets
        let ticketIndex
        allTickets = event.tickets
        ticketIndex = allTickets.findIndex(this.thisTicket)
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
            {this.props.getComments(this.props.match.params.id1, this.props.match.params.id2)}
            <h1>Event Name: {event.title} </h1>
            <h2>Seller: {currentTicket.author}</h2>
            <h2 className={riskClass}>Risk: {currentTicket.risk} %</h2>
            <h3>Price: € {currentTicket.price}</h3>
            <img src={currentTicket.picture} alt={"ticketPicture"}></img>
            <h3>Description: {currentTicket.description}</h3>

            {/* {console.log("current user", this.props.currentUser)}
            {console.log("all users", this.props.users)} */}

            <div>
                {Object.values(currentTicket.comments).sort((a, b) => b.id - a.id).map(comment => this.renderComment(comment, classes))}
                {/* {currentTicket.comments.map(comment => this.renderComment(comment))} */}
            </div>

            <h2>Create A New Comment</h2>

            {!this.props.authenticated && <p>You need to login to add a comment</p>}

            {this.props.authenticated && <div>

                <CreateComment onSubmit={this.handleSubmit} />
            </div>}
        </Paper>)
    }
}

const mapStateToProps = (state, props) => ({
    authenticated: state.currentUser !== null,
    users: state.users === null ? null : state.users,
    // currentUser: state.currentUser,
    event: state.events && state.events[props.match.params.id1],
    // tickets: state.events && state.events[props.match.params.id1].tickets
})

const mapDispatchToProps = {
    getEvents, getUsers, getTickets, getTicketRisk, createComment, getComments
}

CommentsList.propTypes = {
    classes: PropTypes.object.isRequired,
};

// export default connect(mapStateToProps, mapDispatchToProps)(CommentsList)

export default compose(
    withStyles(styles),
    connect(mapStateToProps, mapDispatchToProps)
)(CommentsList);
