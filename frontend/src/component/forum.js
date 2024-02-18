import React from 'react';
import '../styles/forum.css';

class Forum extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			forums: null
		};
	}

	getForums = () => {
		let bodyForums = [];
		fetch('/api/forum/main')
			.then((response) => response.json())
			.then((result) => {
				for (let index = 0; index < result.length; index++) {
					bodyForums.push(
						<tr>
							<td>
								<a href={`/forum/discussions/${result[index].id}`}>
									<h1>{result[index].header}</h1>
								</a>
								<p>{result[index].about}</p>
							</td>
							<td>{result[index].topic_count}</td>
							<td>{result[index].messages_count}</td>
						</tr>
					);
				}
				this.setState({ forums: bodyForums });
			})
			.catch((result) => {
				console.log(result);
			});
	};

	componentDidMount() {
		this.getForums();
	}

	render() {
		return (
			<div className="container" style={{ display: 'block' }}>
				<div className="header">
					<h1>cheeeeeess forum</h1>
					<input placeholder="Поиск" className="search-input" />
				</div>
				<table className="categories">
					<thead>
						<tr>
							<th className="subject"></th>
							<th>Темы</th>
							<th>Сообщений</th>
						</tr>
					</thead>
					<tbody>{this.state.forums}</tbody>
				</table>
			</div>
		);
	}
}

export default Forum;
