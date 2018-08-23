import React, { PureComponent } from 'react'
import './CommentsList.css'

export default class CreateComment extends PureComponent {
	state = {}

	handleSubmit = (e) => {
		e.preventDefault()
		this.props.onSubmit(this.state)
		this.setState({})
	}

	handleChange = (comment) => {
		const { name, value } = comment.target

		this.setState({
			[name]: value
		})
	}

	render() {
		console.log(this.state.text)
		console.log(this.state)
		// let n =  new Date();
		// let currentDate = `${n.getFullYear()}-${n.getMonth() + 1}-${n.getDate()}`
		// let currentDate = new Date().toISOString().split("T")[0];
		return (
			<div className="signup-form">
				<form onSubmit={this.handleSubmit}>
					<label>
						Text
            <input type="text" name="text" value={
							this.state.text || ''
						} onChange={this.handleChange} />
					</label>

                    <button type="submit">Add Comment</button>
				</form>
			</div>
		)
	}
}
