import React, { PureComponent } from 'react'
import './TicketsList.css'

export default class CreateTicket extends PureComponent {
	state = {}

	handleSubmit = (e) => {
		e.preventDefault()
		this.props.onSubmit(this.state)
	}

	handleChange = (ticket) => {
		const { name, value } = ticket.target

		this.setState({
			[name]: value
		})
	}

	render() {
		// let n =  new Date();
		// let currentDate = `${n.getFullYear()}-${n.getMonth() + 1}-${n.getDate()}`
		// let currentDate = new Date().toISOString().split("T")[0];
		return (
			<div className="signup-form">
				<form onSubmit={this.handleSubmit}>
					
                    <label>
						Picture
            <input type="text" name="picture" value={
							this.state.picture || ''
						} onChange={this.handleChange} />
					</label>

                    <label>
						Price
  					<input type="number" name="price" value={
							this.state.price || ''
						} onChange={this.handleChange} />
					</label>

					<label>
						Description
            <input type="text" name="description" value={
							this.state.description || ''
						} onChange={this.handleChange} />
					</label>

					<button type="submit">Create Ticket</button>
				</form>
			</div>
		)
	}
}
