import React from 'react';
import '../styles/chessboard.css';
import { Chessboard } from 'react-chessboard';

// JsonDescription - содержание партии справа
// пример JsonDescription:
	// {
	// 	type: 'description',
	// 	content: "текст"
	// },
	// {
	// 	type: 'main-moves',
	// 	content: [{
	// 		type: 'tr',
	// 		content: [
	// 			{ type: 'index', content: '1.' },
	// 			{ type: 'move', fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 1 6', content: 'e4' },
	// 			{ type: 'move', fen: '', content: 'e4' },
	// 		]x
	// 	}]
	// },
	// {
	// 	type: 'other-moves',
	// 	content: [
	// 		{ type: 'index', content: '1.' },
	// 		{ type: 'move', fen: '', content: 'e4' },
	// 		{ type: 'move', fen: '', content: 'e4' },
	// 	]
	// }

class Lesson extends React.Component {
	constructor(props) {
		super(props);
		const parts = window.location.href.split('/');
		this.state = {
			lessonId: parseInt(parts[parts.length - 1]),
			info: {
				header: null,
				JsonDescription: []
			}
		};
	}

	getInfo = () => {
		fetch(`/api/lessons/lesson/${this.state.lessonId}`)
			.then((response) => response.json())
			.then((result) => {
				this.setState({info: {
					JsonDescription: JSON.parse(result[0].game),
					header:  result[0].header
				}});
			})
			.catch((err) => {
				console.log(err);
			});
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
							<pre>
								{JSon[index].content}
							</pre>
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

	// получаем json информации об партии, переводим в jsx, возвращаем.
	Description = () => {
		return this.fromJsonToJSX(this.state.info.JsonDescription);
	};

	loadPoss = (fen) => {
		this.setState({ fen: fen });
	};

	componentDidMount() {
		this.getInfo();
	}

	render() {
		document.title = this.state.info.header;

		return (
			<div className="container" style={{ display: 'block' }}>
				<h1>{this.state.info.header}</h1>
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
