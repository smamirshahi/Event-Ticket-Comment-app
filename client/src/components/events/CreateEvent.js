import React, { PureComponent } from 'react'
import './EventsList.css'

export default class CreateEvent extends PureComponent {
	state = {}

	handleSubmit = (e) => {
		e.preventDefault()
		this.props.onSubmit(this.state)
	}

	handleChange = (event) => {
		const { name, value } = event.target
		

		this.setState({
			[name]: value,
		})
	}

	render() {
		// let n =  new Date();
		// let currentDate = `${n.getFullYear()}-${n.getMonth() + 1}-${n.getDate()}`
		let currentDate = new Date().toISOString().split("T")[0];
		return (
			<div className="signup-form">
				<form onSubmit={this.handleSubmit}>
					<label>
						Title
            <input type="text" name="title" value={
							this.state.title || ''
						} onChange={this.handleChange} />
					</label>

					<label>
						Description
            <input type="text" name="description" value={
							this.state.description || ''
						} onChange={this.handleChange} />
					</label>

					<label>
						Picture
            <input type="text" name="picture" value={
							this.state.picture || ''
						} onChange={this.handleChange} />
					</label>

					<label>
						Start
  					<input type="date" min={currentDate} name="start" value={
							this.state.start || ''
						} onChange={this.handleChange} />
					</label>

					<label>
						End
  					<input type="date" min={this.state.start} name="end" value={
							this.state.end || ''
						} onChange={this.handleChange} />
					</label>

					<button type="submit">Create Event</button>
				</form>
			</div>
		)
	}
}
