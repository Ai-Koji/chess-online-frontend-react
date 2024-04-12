import React from 'react';
import '../styles/debut-main.css';
import { Chessboard } from 'react-chessboard';

class DebutBase extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			debutsList: null,
		};
	}

	getInfo = () => {
		let body = [];
		fetch('/api/debuts/main')
			.then((response) => response.json())
			.then((result) => { // {id, header, mainFEN}
				for (let index = 0; index < result.length; index++)
					body.push(
						<li className="debut-item">
							<a href={`/debuts/debut/${result[index].id}`}>
								<h6>{result[index].header}</h6>
								<div className="debut-board">
									<Chessboard position={result[index].mainFEN} />
								</div>
							</a>
						</li>)
				this.setState({debutsList: body})
			})
			.catch((err) => {
				console.log(err);
			});
	};

	componentDidMount() {
		this.getInfo();
	}

	render() {
		document.title = "Дебюты";

		return (
			<div className="container">
				<section className="debut-list">
					<h1>Список дебютов</h1>
					<ul id="debut-items" className="debut-grid">
						{this.state.debutsList}
					</ul>
				</section>
			</div>
		);
	}
}

export default DebutBase;
