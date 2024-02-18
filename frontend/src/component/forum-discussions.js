import React from 'react';
import '../styles/forum-list.css';
import arrowBack from '../images/arrow-back.svg';

class ForumDiscussions extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			discussions: null
		};
	}

	GetDiscussions = () => {
		let bodyDiscussions = [];
		const currentUrl = window.location.href;
		const parts = currentUrl.split('/');
		const lastNumber = parseInt(parts[parts.length - 1]);
		fetch(`/api/forum/discussions/${lastNumber}`)
			.then((response) => response.json())
			.then((result) => {
				for (let index = 0; index < result.discussions.length; index++) {
					bodyDiscussions.push(
						<tr>
							<td>
								<a
									href={`/forum/discussion/${lastNumber}/${result.discussions[index].id}`}
								>
									<h3>{result.discussions[index].header}</h3>
								</a>
							</td>
							<td>{result.discussions[index].answer_count}</td>
							<td>{result.discussions[index].create_date}</td>
						</tr>
					);
				}
				this.setState({ discussions: bodyDiscussions, header: result.header });
			})
			.catch((result) => {
				console.log(result);
			});
	};

	componentDidMount() {
		this.GetDiscussions();
	}

	render() {
		const currentUrl = window.location.href;
		const parts = currentUrl.split('/');
		const lastNumber = parseInt(parts[parts.length - 1]);
		return (
			<div className="container" style={{ display: 'block' }}>
				<div className="header">
					<a href="/forum" className="back">
						<img src={arrowBack} />
					</a>
					<h1>{this.state.header}</h1>
					<a
						href={`/forum/forum-create-discussion/${lastNumber}`}
						className="create"
					>
						СОЗДАТЬ НОВУЮ ТЕМУ
					</a>
				</div>
				<table className="list">
					<thead>
						<tr>
							<th className="subject"></th>
							<th className="count">Ответы</th>
							<th className="author">дата создания</th>
						</tr>
					</thead>
					<tbody>{this.state.discussions}</tbody>
				</table>
			</div>
		);
	}
}

export default ForumDiscussions;
