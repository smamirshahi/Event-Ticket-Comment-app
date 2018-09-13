import React, { PureComponent } from 'react'
import './SignupForm.css'

export default class SignupForm extends PureComponent {
	state = {}

	handleSubmit = (e) => {
		e.preventDefault()
		this.props.onSubmit(this.state)
	}

	handleChange = (event) => {
		const { name, value } = event.target

		this.setState({
			[name]: value
		})
	}

	render() {
		return (
			<div className="signup-form">
				<form onSubmit={this.handleSubmit}>
					<label>
						Firstname
            <input type="text" name="firstName" value={
							this.state.firstName || ''
						} onChange={this.handleChange} />
					</label>

					<label>
						Lastname
            <input type="text" name="lastName" value={
							this.state.lastName || ''
						} onChange={this.handleChange} />
					</label>

					<label>
						Email
            <input type="text" name="email" value={
							this.state.email || ''
						} onChange={this.handleChange} />
					</label>

					<label>
						Password
  					<input type="password" name="password" value={
							this.state.password || ''
						} onChange={this.handleChange} />
					</label>

					<label>
						Confirm password
  					<input type="password" name="confirmPassword" value={
							this.state.confirmPassword || ''
						} onChange={this.handleChange} />
					</label>

					{
						this.state.password &&
						this.state.confirmPassword &&
						this.state.password !== this.state.confirmPassword &&
						<p style={{ color: 'red' }}>The passwords do not match!</p>
					}

					{
						this.state.password &&
						this.state.password.length < 8 &&
						<p style={{ color: 'red' }}>The password must be at least 8 characters!</p>
					}

					<button type="submit">Sign up</button>
				</form>
			</div>
		)
	}
}
