import React from 'react';
import '../styles/forum-create-discussion.css';
import { Navigate } from 'react-router-dom';
import arrowBack from '../media/arrow-back.svg';

class CreateTopic extends React.Component {
	constructor(props) {
		const currentUrl = window.location.href;
		const parts = currentUrl.split('/');

		super(props);
		this.state = {
			isNavigate: false,
			isToReg: false,
			discussionId: null,
			forumId: parseInt(parts[parts.length - 1]),
			status: {
				message: null,
				statusCode: null
			}
		};
	}

	Status = () => {
		if (
			this.state.status.statusCode === 400 ||
			this.state.status.statusCode === 500
		)
			return (
				<div className="status status-error">{this.state.status.message}</div>
			);
	};

	sendForm = (event) => {
		event.preventDefault();

		const form = document.getElementById('form');
		let formData = new FormData(form);

		formData.append('forum_class_id', this.state.forumId);

		fetch('/api/forum/create-discussion', {
			method: 'POST',
			body: formData
		})
			.then((response) => {
				if (response.status === 200)
					response.json().then((result) => {
						this.setState({
							isNavigate: true,
							discussionId: result.result[0].discussionId
					});})
				else if (response.status === 400)
					this.setState({
						status: {
							message: 'Заполните пропущенное поле',
							statusCode: 400
						}
					});
				else if (response.status === 403)
					this.setState({
						isNavigate: true,
						isToReg: true
					});
				else if (response.status === 500)
					this.setState({
						status: {
							message:
								'Ошибка со стороны сервера, попробуйте позже или свяжитесь с администраторами',
							statusCode: 500
						}
					});
			})
			.catch((error) => {
				this.setState({
					status: {
						message: `Ошибка со стороны сервера, попробуйте позже или свяжитесь с администраторами: ${error}`,
						statusCode: 500
					}
				});
			});
	};

	render() {
		document.title = "Новое обсуждение";

		let url = this.state.isToReg
			? '/auth/login'
			: `/forum/discussion/${this.state.forumId}/${this.state.discussionId}`;
		if (this.state.isNavigate) return <Navigate to={url} />;

		return (
			<div className="container">
				<div className="header">
					<a href={`/forum/discussions/${this.state.forumId}`} className="back">
						<img src={arrowBack} />
					</a>
					<h1>Создать тему обсуждение</h1>
				</div>
				<hr />
				<div className="answer-form">
					<form id="form" onSubmit={this.sendForm}>
						<label>Заголовок темы</label>
						<input name="header" type="text" />

						<label>Сообщение</label>
						<textarea id="message" name="message" rows="4" required></textarea>

						<this.Status />

						<input type="submit" value="СОЗДАТЬ ТЕМУ" />
					</form>
				</div>
			</div>
		);
	}
}

export default CreateTopic;
