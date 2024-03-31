import React from 'react';
import arrowBack from '../images/arrow-back.svg';
import '../styles/forum-page.css';
import { Navigate } from 'react-router-dom';

class ForumPage extends React.Component {
	constructor(props) {
		super(props);
		const parts = window.location.href.split('/');
		this.state = {
			discussionId: parseInt(parts[parts.length - 1]),
			isNavigate: false,
			limit: 0,
			header: '',
			answers: null
		};
	}

	answers = () => {
		this.state.limit += 10;
		let bodyAnswers = [];
		fetch(`/api/forum/answers/${this.state.discussionId}/${this.state.limit}`)
			.then((response) => response.json())
			.then((result) => {
				console.log(result);
				for (let index = 0; index < result.discussions.length; index++) {
					bodyAnswers.push(
						<div className="message">
							<div className="message-header">
								<div
									className={
										result.discussions[index].isAuthor ? 'author' : 'user'
									}
								>
									<h3>{result.discussions[index].username}</h3>
								</div>
								<div className="time">
									<h3>{result.discussions[index].date}</h3>
								</div>
							</div>
							<div className="message-main">
								<p>{result.discussions[index].content}</p>
							</div>
						</div>
					);
				}
				this.setState({ header: result.header, answers: bodyAnswers });
			})
			.catch((result) => {
				console.log(result);
			});
	};

	sendAnswer = (event) => {
		event.preventDefault();

		const form = document.getElementById('form');
		let formData = new FormData(form);

		fetch(`/api/forum/answer/${this.state.discussionId}`, {
			method: 'POST',
			body: formData
		})
			// добавить статусы
			.then((response) => {
				if (response.status === 200) {
					this.state.limit += 10;
					this.answers();
				}
				if (response.status === 403) this.setState({isNavigate: true})
			})
			.catch((error) => {
				console.log(error);
			});
	};

	componentDidMount() {
		this.answers();
	}

	render() {
		if (this.state.isNavigate) return <Navigate to="/auth/login" />;

		return (
			<div className="container">
				<div className="header">
					<a href={`/forum/discussions/${this.state.discussionsId}`} className="back">
						<img src={arrowBack} />
					</a>
					<h1>{this.state.header}</h1>
				</div>
				<div className="message-list">{this.state.answers}</div>
				<button className="show-more" onClick={this.answers}>
					Показать еще
				</button>
				<div className="answer-form">
					<form id="form" onSubmit={this.sendAnswer}>
						<h1>Ответить</h1>
						<textarea
							id="message"
							name="message"
							rows="4"
							placeholder="Введите ваше сообщение"
							required
						></textarea>
						<input type="submit" value="Отправить" />
					</form>
				</div>
			</div>
		);
	}
}

export default ForumPage;
