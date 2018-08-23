import React, { PureComponent } from 'react'
import PropTypes from 'prop-types';
import { getTickets, createTicket } from '../../actions/tickets'
import { getEvents } from '../../actions/events'
import { getUsers } from '../../actions/users'
import CreateTicket from './CreateTicket'
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
import './TicketsList.css'
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


class TicketsList extends PureComponent {
    state = { expanded: false };
    componentWillMount() {
        if (this.props.event === null) this.props.getEvents()
        if (this.props.authenticated) {
            if (this.props.users === null) this.props.getUsers()
        }
    }

    handleSubmit = (data) => {
        this.props.createTicket(data.picture, data.price, data.description, this.props.match.params.id1)
    }

    renderTicket = (ticket, classes) => {
        const { /* users,  */history } = this.props
        let riskClass
        if (ticket.risk > 70) riskClass = "risky"
        else if (ticket.risk > 30) riskClass = "normalRisk"
        else riskClass = "safe"

        return (<Card key={ticket.id} className={`${classes.card}`}>
            <CardHeader
                title={`Seller: ${ticket.author}`}
                subheader={`Price: € ${ticket.price}`}
            />
            <CardContent>
                {/* <Typography variant="headline" component="h2">
                    {event.title}
                </Typography> */}
                <Typography variant="subheading" component="h2" className={classes[riskClass]}>
                    Risk: {ticket.risk} %
                </Typography>
                <CardMedia
                    className={classes.media}
                    title={ticket.author}
                    style={{ height: 100 }}
                    image={ticket.picture}
                />
                <Typography component="p">
                    {ticket.description}
                </Typography>
            </CardContent>
            <CardActions className={classes.actions} disableActionSpacing>
                <IconButton aria-label="Edit">
                    <EditIcon />
                </IconButton>
                <IconButton aria-label="Label">
                    <DeleteIcon />
                </IconButton>
            </CardActions>
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
        const { event, /* tickets,  */users, classes /* authenticated *//* , createEvent */ } = this.props
        // console.log("tickets",this.props.tickets)
        // if (!authenticated) return (
        //     <Redirect to="/login" />
        // )

        if (event === null && users === null) return 'Loading ...'

        return (<Paper className="outer-paper">
            <h1>Event: {event.title}</h1>
            <div>
                {Object.values(event.tickets).sort((a, b) => b.id - a.id).map(ticket => this.renderTicket(ticket, classes))}
                {/* {event.tickets.map(ticket => this.renderTicket(ticket))} */}
            </div>

            <h2>Create A New Ticket</h2>

            {!this.props.authenticated && <p>You need to login to create a ticket</p>}

            {this.props.authenticated && <div>

                <CreateTicket onSubmit={this.handleSubmit} />
            </div>}
        </Paper>)
    }
}

const mapStateToProps = (state, props) => ({
    authenticated: state.currentUser !== null,
    users: state.users === null ? null : state.users,
    event: state.events && state.events[props.match.params.id1],
})

const mapDispatchToProps = {
    getEvents, getUsers, getTickets, createTicket
}

TicketsList.propTypes = {
    classes: PropTypes.object.isRequired,
};

// export default connect(mapStateToProps, mapDispatchToProps)(TicketsList)

export default compose(
    withStyles(styles),
    connect(mapStateToProps, mapDispatchToProps)
)(TicketsList);
