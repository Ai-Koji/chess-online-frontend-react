import React from 'react';
import '../styles/debut-base.css';
import { Chessboard } from 'react-chessboard';

class DebutBase extends React.Component {
	// add fetch
	getDebutesList() {
		// here will be fetch, witch will get save from server
		return [];
	}

	DebutList() {
		// {url, name, FEN, RGB}
		let games = [];
		games = this.getDebutesList();

		let elements = [];
		for (let index = 0; index < games.length; index++) {
			elements.push(
				<li className="debut-item">
					<a href={games[index].url}>
						<h2>{games[index].name}</h2>
						<div className="debut-board">
							<Chessboard position={games[index].FEN} />
						</div>
					</a>
				</li>
			);
		}

		return elements;
	}

	render() {
		return (
			<section className="container">
				<section className="debut-list">
					<h1>Список дебютов</h1>
					<div className="search-box">
						<input
							type="text"
							id="search-input"
							placeholder="Поиск дебюта..."
						/>
						<button id="search-button">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								className="bi bi-search"
								viewBox="0 0 16 16"
							>
								<path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
							</svg>
						</button>
					</div>
					<ul id="debut-items" className="debut-grid">
						{this.DebutList()}
					</ul>
				</section>
			</section>
		);
	}
}

export default DebutBase;
