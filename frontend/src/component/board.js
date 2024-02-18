import React from 'react';
import '../styles/board.css';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

class SavedGamesList extends React.Component {
	// add fetch
	getSavedGames() {
		// here will be fetch, witch will get save from server
		return [];
	}

	GamesList() {
		// {url, name, FEN, RGB}
		let savedGames = [];

		savedGames = this.getSavedGames();

		let elements = [];
		for (let index = 0; index < savedGames.length; index++) {
			elements.push(
				<li className="save-item">
					<a href={savedGames[index].url}>
						<h2>{savedGames[index].name}</h2>
						<div className="save-board">
							<Chessboard position={savedGames[index].FEN} />
						</div>
					</a>
				</li>
			);
		}

		return elements;
	}

	render() {
		return <ul className="save-grid">{this.GamesList()}</ul>;
	}
}

class Board extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [],
			game: new Chess()
		};
	}

	clearBoard = () => {
		this.setState({
			history: [],
			game: new Chess()
		});
	};

	History = (props) => {
		const { history } = props;
		let elements = [];

		let moveCount = 0;

		for (let index = 0; index < history.length; index += 2) {
			if (index % 2 === 0) {
				moveCount++;
			}

			elements.push(
				<tr key={index}>
					<index>{moveCount}</index>
					<move>{history[index]}</move>
					<move>{history[index + 1]}</move>
				</tr>
			);
		}

		return <tbody>{elements}</tbody>;
	};

	makeAMove = (move) => {
		const gameCopy = new Chess(this.state.game.fen());
		console.log(this.state.game.fen());
		gameCopy.move(move);
		this.setState((prevState) => ({
			game: gameCopy,
			history: [...prevState.history, gameCopy.history()[0]]
		}));
	};

	onDrop = (sourceSquare, targetSquare) => {
		// try - need for legal moves
		try {
			this.makeAMove({
				from: sourceSquare,
				to: targetSquare,
				promotion: 'q'
			});
		} catch (error) {
			// Handle any errors here
		}
	};

	render() {
		return (
			<section className="container" style={{ display: 'block' }}>
				<section className="board-name">
					<b>
						<input placeholder="Название партии" type="text" id="board-name" />
					</b>
				</section>
				<section className="chess-game">
					<div className="chess-board">
						<div className="active-move">
							<div
								id="active-marker"
								style={{ bottom: 0, transition: 'bottom 1s' }}
							></div>
						</div>
						<Chessboard
							className="chessboard"
							style={{ height: '40vh' }}
							position={this.state.game.fen()}
							onPieceDrop={this.onDrop}
						/>
					</div>
					<div className="history">
						<table id="history-table">
							<this.History history={this.state.history} />
						</table>
					</div>
				</section>
				<section className="options">
					<button id="delete-game">Удалить</button>
					<button id="save-game">Сохранить</button>
					<button id="clear-board" onClick={this.clearBoard}>
						Очистить доску
					</button>
					<button id="open-close-for-share">
						Скрыть от всех/Открыть для всех
					</button>
					<button id="share-game">Поделиться</button>
				</section>
				<section className="save">
					<h1>Сохраненные партии</h1>
					<SavedGamesList />
				</section>
			</section>
		);
	}
}

export default Board;
