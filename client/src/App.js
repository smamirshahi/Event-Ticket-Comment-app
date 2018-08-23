import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import LoginPage from './components/login/LoginPage'
import SignupPage from './components/signup/SignupPage'
import EventsList from './components/events/EventsList'
import TicketsList from './components/tickets/TicketsList'
import CommentsList from './components/comments/CommentsList'
import LogoutPage from './components/logout/LogoutPage'
import './App.css'
import TopBar from './components/layout/TopBar'

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <nav>
            <TopBar />
          </nav>
          <main style={{ marginTop: 75 }}>
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/logout" component={LogoutPage} />
            <Route exact path="/signup" component={SignupPage} />
            <Route exact path="/events" component={EventsList} />
            <Route exact path="/events/:id1/tickets" component={TicketsList} />
            <Route exact path="/events/:id1/tickets/:id2" component={CommentsList} />
            <Route exact path="/" render={() => <Redirect to="/events" />} />
          </main>
        </div>
      </Router>
    )
  }
}
export default App
