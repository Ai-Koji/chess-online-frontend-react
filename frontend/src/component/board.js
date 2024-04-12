import React from 'react';
import '../styles/chessboard.css';
import '../styles/board.css';
import { Chessboard } from 'react-chessboard';

// JsonDescription - содержание партии справа
// пример JsonDescription:
	// [{
	// 	type: 'description',
	// 	content: [
	// 		{ type: 'text', content: 'just text' },
	// 		{ type: 'text', content: 'just text2' }
	// 	]
	// },
	// {
	// 	type: 'main-moves',
	// 	content: [{
	// 		type: 'tr',
	// 		content: [
	// 			{ type: 'index', content: '1.' },
	// 			{ type: 'move', fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 1 6', content: 'e4' },
	// 			{ type: 'move', fen: '', content: 'e4' },
	// 		]
	// 	}]
	// },
	// {
	// 	type: 'other-moves',
	// 	content: [
	// 		{ type: 'index', content: '1.' },
	// 		{ type: 'move', fen: '', content: 'e4' },
	// 		{ type: 'move', fen: '', content: 'e4' },
	// 	]
	// }]

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
			prevFen: null,
			fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
			JsonDescription: [{
				type: 'description',
				content: [
					'just text'
				]
			},
			{
				type: 'main-moves',
				content: [{
					type: 'tr',
					content: [
						{ type: 'index', content: '1.' },
						{ type: 'move', fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 1 6', content: 'e4' },
						{ type: 'move', fen: '', content: 'e4' },
					]
				}]
			},
			{
				type: 'other-moves',
				content: [
					{ type: 'index', content: '1.' },
					{ type: 'move', fen: '', content: 'e4' },
					{ type: 'move', fen: '', content: 'e4' },
				]
			}]
		};
	}

	clearBoard = () => {
		this.setState({
			prevFen: null,
			fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
		});
	};

	loadPoss = (fen) => {
		this.setState({ fen: fen });
	};
	
	fromJsonToJSX = (JSon) => {
		let body = [];

		for (let index = 0; index < JSon.length; index++) {
			switch (JSon[index].type) {
				case 'index':
					body.push(<index key={index}>{JSon[index].content}</index>);
					break;
				case 'move':
					body.push(
						<move key={index} onClick={() => this.loadPoss(JSon[index].fen)}>
							{JSon[index].content}
						</move>
					);
					break;
				case 'tr':
					body.push(<tr>{this.fromJsonToJSX(JSon[index].content)}</tr>);
					break;
				case 'description':
					body.push(
						<div key={index} className="description">
							<textarea rows="6" value={JSon[index].content} onChange={(event) => this.handleTextChange(index, event)} />
						</div>
					);
					break;
				case 'main-moves':
					body.push(
						<table key={index} className="main-moves">
							<tbody>{this.fromJsonToJSX(JSon[index].content)}</tbody>
						</table>
					);
					break;
				case 'other-moves':
					body.push(
						<div key={index} className="other-moves">
							{this.fromJsonToJSX(JSon[index].content)}
						</div>
					);
					break;
				default:
					break;
			}
		}

		return body;
	};


	Description = () => {
		return this.fromJsonToJSX(this.state.JsonDescription);
	};


	// сохраняет текст введенный пользователем
	handleTextChange = (blockIndex, event) => {
		const updatedJsonDescription = [...this.state.JsonDescription];
		updatedJsonDescription[blockIndex].content = event.target.value;
		this.setState({ JsonDescription: updatedJsonDescription });
	};


	// добавляет блок для текста
	addDescriptionBlock = () => {
		const newBlock = { type: 'description', content: '' };
		const updatedJsonDescription = [...this.state.JsonDescription, newBlock];
		this.setState({ JsonDescription: updatedJsonDescription });
	  };
	  
	// добавляет блок со списком основных ходов
	addMainMovesBlock = () => {
		const newBlock = { type: 'main-moves', content: [{ type: 'tr', content: [] }] };
		const updatedJsonDescription = [...this.state.JsonDescription, newBlock];
		this.setState({ JsonDescription: updatedJsonDescription });
	};
	
	// добавляет блок с текстом и ходами
	addOtherMovesBlock = () => {
		const newBlock = { type: 'other-moves', content: [{ type: 'tr', content: [] }] };
		const updatedJsonDescription = [...this.state.JsonDescription, newBlock];
		this.setState({ JsonDescription: updatedJsonDescription });
	};

	// получает fen после каждого изменения доски
	positionsToFen = (positions) => {
		// получаем fen на основе позиции
		const pieceMap = {
			'wP': 'P', 'wN': 'N', 'wB': 'B', 'wR': 'R', 'wQ': 'Q', 'wK': 'K',
			'bP': 'p', 'bN': 'n', 'bB': 'b', 'bR': 'r', 'bQ': 'q', 'bK': 'k',
		};
	
		let fen = '';
		let emptySquares = 0;
	
		for (let rank = 8; rank >= 1; rank--) {
			for (let file = 1; file <= 8; file++) {
				const square = String.fromCharCode(96 + file) + rank;
				const piece = positions[square];
	
				if (piece) {
					if (emptySquares > 0) {
						fen += emptySquares;
						emptySquares = 0;
					}
					fen += pieceMap[piece];
				} else {
					emptySquares++;
				}
			}
	
			if (emptySquares > 0) {
				fen += emptySquares;
				emptySquares = 0;
			}
	
			if (rank > 1) {
				fen += '/';
			}
		}
		
		this.setState({ prevFen: this.state.fen, fen: fen });
	}
		
	render() {
		document.title = "Доска";

		return (
			<section className="container" style={{ display: 'block' }}>
				<section className="board-name">
					<b>
						<input placeholder="Название партии" type="text" id="board-name" />
					</b>
				</section>
				<div className="grid-container">
					<div className="board chessboard">
						<Chessboard position={this.state.fen} getPositionObject={this.positionsToFen}/>
					</div>
					<div className="about-game" onContextMenu={this.handleContextMenu}>
						<div className="game">
							<this.Description />
						</div>
							<div className="game-buttons">
								<button onClick={this.addDescriptionBlock}>TXT</button>
								<button onClick={this.addMainMovesBlock}>Moves</button>
								<button onClick={this.addOtherMovesBlock}>TXT Moves</button>
							</div>
					</div>
				</div>
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
