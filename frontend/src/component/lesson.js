import React from 'react';
import '../styles/chessboard.css';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

class Lesson extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			fen: '',
			info: {
				JSonDescription: [
					{
						type: 'description',
						content: [
							{ type: 'text', content: 'just text' },
							{ type: 'text', content: 'just text2' }
						]
					},
					{
						type: 'main-moves',
						content: [{
							type: 'tr',
							content: [
								{ type: 'index', content: '1.' },
								{ type: 'move', fen: '', content: 'e4' },
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
					}
				]
			}
		};
	}

	getInfo = () => {
		// получает все значения от сервера
	}

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
							{this.fromJsonToJSX(JSon[index].content)}
						</div>
					);
					break;
				case 'text':
					body.push(<p key={index}>{JSon[index].content}</p>);
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

	// получаем json информации об партии, переводим в jsx, возвращаем.
	Description = () => {
		return this.fromJsonToJSX(this.state.info.JSonDescription);
	};

	loadPoss = (fen) => {
		this.setState({ fen: fen });
	};

	render() {
		return (
			<div className="container" style={{ display: 'block' }}>
				<h1>Итальянска партия</h1>
				<div className="grid-container">
					<section className="board chessboard">
						<Chessboard position={this.state.fen} />
					</section>
					<section className="about-game">
						<div className="game">
							<this.Description />
						</div>
					</section>
				</div>
			</div>
		);
	}
}

export default Lesson;
