import React, { PureComponent } from 'react'
import PropTypes from 'prop-types';
import { getEvents, createEvent } from '../../actions/events'
import { getUsers } from '../../actions/users'
import CreateEvent from './CreateEvent'
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
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import MoreVertIcon from '@material-ui/icons/MoreVert';
import './EventsList.css'
import compose from 'recompose/compose';

const styles = theme => ({
    card: {
      maxWidth: 400,
      margin: 50,
      borderStyle: 'dashed'
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

class EventsList extends PureComponent {
    state = { expanded: false };
    componentWillMount() {
        if (this.props.events === null) this.props.getEvents()
        if (this.props.authenticated) {
            if (this.props.events === null) this.props.getEvents()
            // read data from server. componentWillMount only runs one time. It reads the current database and copy it to the React state. After that, any changes in the database will update in react and database together
            if (this.props.users === null) this.props.getUsers()
        }
    }

    handleSubmit = (data) => {
        this.props.createEvent(data.title, data.description, data.picture, data.start, data.end)
    }

    renderEvent = (event, classes) => {
        const { /* users,  */history } = this.props
        // console.log("history", history)

        return (<Card key={event.id} className={classes.card}>
            <CardHeader        
                title={event.title}
                subheader={`from ${event.start} to ${event.end}`}
             />


            <CardContent>
                {/* <Typography variant="headline" component="h2">
                    {event.title}
                </Typography> */}
                <Typography variant="subheading" component="h2">
                    Created by: {event.author}
                </Typography>
                <CardMedia
                    className={classes.media}
                    title={event.title}
                    style={{ height: 100 }}
                    image={event.picture}
                />
                <Typography component="p">
                    {event.description}
                </Typography>
            </CardContent>
            {/* <CardContent className="textss">
                <p>{event.start}</p>
                <p>{event.end}</p>
            </CardContent> */}
            <CardActions className={classes.actions} disableActionSpacing>
          <IconButton aria-label="Edit">
            <EditIcon />
          </IconButton>
          <IconButton aria-label="Delete">
            <DeleteIcon />
          </IconButton>
        </CardActions>
            <CardActions>
                <Button
                    size="small"
                    onClick={() => history.push(`/events/${event.id}/tickets`)}
                >
                    See Tickets
        </Button>
            </CardActions>
        </Card>)
    }

    render() {
        const { events, users, classes /* authenticated *//* , createEvent */ } = this.props
        // console.log(classes)
        let n = new Date();
        // if (!authenticated) return (
        //     <Redirect to="/login" />
        // )

        if (events === null && users === null) return "...Loading"

        return (<Paper className="outer-paper">
            <div>
                {events.map(event => {
                    return (n.getTime() < new Date(event.end).getTime()) &&
                        this.renderEvent(event, classes)
                })}
            </div>

            <h2>Create A New Event</h2>

            {!this.props.authenticated && <p>You need to login to create an event</p>}

            {this.props.authenticated && <div>

                <CreateEvent onSubmit={this.handleSubmit} />
            </div>}
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

EventsList.propTypes = {
    classes: PropTypes.object.isRequired,
  };

// export default connect(mapStateToProps, mapDispatchToProps)(EventsList)

export default compose(
    withStyles(styles),
    connect(mapStateToProps, mapDispatchToProps)
  )(EventsList);