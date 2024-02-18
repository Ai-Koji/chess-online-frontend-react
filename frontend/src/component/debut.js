import React from 'react';
import '../styles/debut.css';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import arrowPrev from '../images/skip-prev1.svg';
import arrowNext from '../images/skip-next1.svg';
import arrowPrev2 from '../images/skip-prev2.svg';
import arrowNext2 from '../images/skip-next2.svg';

/* 
1.1
[
    ...,
    [   
        [...],
        [[...], [...], ...],
        [[...], [[...], [...]]],
    ],
    ...
]
*/

/* Как работает:

есть массив со списком строк(1.1),
эти строки содержат fen доски
*/

// to do:
// добавить

class Debut extends React.Component {
	elements = [1, 2, 3, 4];
	constructor(props) {
		super(props);
		this.startIndex = [0];
		this.endIndex = [1, 0];

		this.fenList = [
			'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
			[
				'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
				'rnbqkbnr/pppp1ppp/8/4p3/4PP2/8/PPPP2PP/RNBQKBNR b KQkq - 0 2',
				'rnbqkbnr/pppp2pp/8/4pp2/4PP2/8/PPPP2PP/RNBQKBNR w KQkq - 0 3'
			]
		];

		this.altenativesMoves = [];
		this.altenativesMovesIndex = [];

		this.state = {
			indexNow: this.endIndex, // массив содержащий индекс фена доски [[index1], [index2], [index3]]
			fenNow: this.getFen(this.endIndex)
		};
	}

	getFen = (index) => {
		// возвращает fen элемента из fenList
		let elements = this.fenList[index[0]];
		// т.к. массив может иметь элементы в виде список, эта функция получает фен из списка
		// индекс является массивом, он содержит индексы, если у него больше одного индекса,
		// то это значит, что он обращается к массиву у которого есть элемент такой-то
		try {
			for (let i = 1; i < index.length; i++) {
				if (typeof elements[i] != 'object' && i != index.length - 1) {
					console.log('error in getFen function');
					return 'error';
				}
				elements = elements[index[i]];
			}
			return elements;
		} catch {
			console.log('error in getFen function');
			return 'error';
		}
	};
	//////////////////////////////////////////////////////////
	// getAlternativeMove нужен для проверки хода в onDrop
	getAlternativeMoveRecursive = (elements, index) => {
		// рекурсивная функция для getAlternativesMoves
		// эта функция получает все ходы из массива
		let alternativesMoves = [];
		let elementsFromObject = [];
		let tempIndex = [...index];
		for (let i = 0; i < elements.length; i++) {
			if (typeof elements[i] == 'object') {
				tempIndex.push(-1);
				elementsFromObject = alternativesMoves.concat(
					this.getAlternativeMoveRecursive(elements[i], tempIndex)
				);
				alternativesMoves = elementsFromObject;
			} else {
				alternativesMoves.push(elements[i]);

				tempIndex[tempIndex.length - 1] = tempIndex[tempIndex.length - 1] + 1;

				this.altenativesMovesIndex.push(tempIndex);
				break;
			}
		}
		return alternativesMoves;
	};

	getAlternativesMoves = () => {
		// получить все возможные ходы для onDrop
		let elements = this.fenList;
		this.altenativesMoves = [];
		try {
			for (let i = 0; i < this.state.indexNow.length - 1; i++) {
				if (
					typeof elements[this.state.indexNow[i]] != 'object' &&
					i != this.state.indexNow.length - 1
				) {
					if (this.fenList.length != 0) {
						console.log('error in getAlternativesMoves function');
					} else {
						console.log(
							'error in getAlternativesMoves function: fenList is empty'
						);
					}
					break;
				}
				elements = elements[this.state.indexNow[i]];
			}

			elements = elements.slice(
				this.state.indexNow[this.state.indexNow.length - 1] + 1
			);
			let temp_elements = [];
			for (let i = 0; i < elements.length; i++) {
				temp_elements.push(elements[i]);
				if (typeof elements[i] != 'object') {
					break;
				}
			}

			elements = temp_elements;
			this.altenativesMovesIndex = [];
			elements = this.getAlternativeMoveRecursive(
				elements,
				this.state.indexNow
			);
			this.altenativesMoves = elements;
		} catch (error) {
			console.log('error in getAlternativesMoves function');
		}
	};

	load = (index) => {
		let fen = this.getFen(index);
		if (fen !== 'error') {
			this.setState({
				fenNow: fen,
				indexNow: index
			});
		} else {
			console.log('error in load function');
		}
	};

	onDrop = (sourceSquare, targetSquare) => {
		//если пользователь ходит, мы проверяем на все возможные ходы по списку и делаем сам ход
		try {
			let getF = new Chess(this.state.fenNow);
			getF.move({
				from: sourceSquare,
				to: targetSquare,
				promotion: 'q'
			});

			let element = getF.fen();
			for (let index = 0; index < this.altenativesMoves.length; index++) {
				if (this.altenativesMoves[index] == element) {
					this.setState({
						fenNow: this.altenativesMoves[index],
						indexNow: this.altenativesMovesIndex[index]
					});
					break;
				}
			}
		} catch (error) {
			console.log('error in onDrop funtion');
		}
	};

	// нужно доработать:
	// случай, если следующий элемент будет обьектом
	// случай, если обьект закончился(prev)
	next = () => {
		let nextIndex = [...this.state.indexNow];
		nextIndex[nextIndex.length - 1] = nextIndex[nextIndex.length - 1] + 1;
		let fen = this.getFen(nextIndex);
		while (typeof fen == 'object' && fen != undefined) {
			nextIndex[nextIndex.length - 1] = nextIndex[nextIndex.length - 1] + 1;
			fen = this.getFen(nextIndex);
		}
		if (fen != undefined) {
			this.load(nextIndex);
		}
	};

	prev = () => {
		let prevIndex = [...this.state.indexNow];
		prevIndex[prevIndex.length - 1] = prevIndex[prevIndex.length - 1] - 1;
		let fen = this.getFen(prevIndex);
		while (typeof fen == 'object' && fen != undefined) {
			prevIndex[prevIndex.length - 1] = prevIndex[prevIndex.length - 1] - 1;
			fen = this.getFen(prevIndex);
		}
		if (fen != undefined) {
			this.load(prevIndex);
		} else if (prevIndex[prevIndex.length - 1] < 0 && prevIndex.length > 1) {
			prevIndex = prevIndex.slice(0, prevIndex[prevIndex.length - 1]);

			fen = this.getFen(prevIndex);
			while (typeof fen == 'object' && fen != undefined) {
				prevIndex[prevIndex.length - 1] = prevIndex[prevIndex.length - 1] - 1;
				fen = this.getFen(prevIndex);
			}
			this.load(prevIndex);
		}
	};

	render() {
		this.getAlternativesMoves();
		return (
			<div className="container" style={{ display: 'block' }}>
				<h1>Итальянска партия</h1>
				<div className="grid-container">
					<section className="board chessboard">
						<Chessboard
							position={this.state.fenNow}
							onPieceDrop={this.onDrop}
						/>
					</section>
					<section className="about-game">
						<div className="game">
							<table className="main-moves">
								<tbody>
									<tr>
										<index>1</index>
										<move
											onClick={() => {
												this.load([1]);
											}}
										>
											e4
										</move>
										<move>e5</move>
									</tr>
								</tbody>
							</table>
							<div className="description">
								<p>тут будет описание</p>
							</div>
							<div className="other-moves">
								<index>1.</index>
								<move>e4</move>
								<move>e5</move>
								<index>1.</index>
								<move>e4</move>
								<move>e5</move>
								отдельные ходы
								<div className="other-moves">
									<index>1.</index>
									<move>e4</move>
									<move>e5</move>
									<index>1.</index>
									<move>e4</move>
									<move>e5</move>
									отдельные ходы2
								</div>
							</div>

							<table className="main-moves">
								<tbody>
									<tr>
										<index>1</index>
										<move>e4</move>
										<move>e5</move>
									</tr>
								</tbody>
							</table>
						</div>
						<div className="buttons">
							<button
								onClick={() => {
									this.load([this.startIndex]);
								}}
							>
								<img src={arrowPrev2} />
							</button>
							<button onClick={this.prev}>
								<img src={arrowPrev} />
							</button>
							<button onClick={this.next}>
								<img src={arrowNext} />
							</button>
							<button
								onClick={() => {
									this.load([this.endIndex]);
								}}
							>
								<img src={arrowNext2} />
							</button>
						</div>
					</section>
				</div>
				<h1 className="recomendation-header">Рекомендуем</h1>
				<ul id="debut-items" className="debut-grid">
					<li className="debut-item">
						<a href="">
							<h2>fds</h2>
							<div className="debut-board">
								<Chessboard />
							</div>
						</a>
					</li>
					<li className="debut-item">
						<a href="">
							<h2>fds</h2>
							<div className="debut-board">
								<Chessboard />
							</div>
						</a>
					</li>
					<li className="debut-item">
						<a href="">
							<h2>fds</h2>
							<div className="debut-board">
								<Chessboard />
							</div>
						</a>
					</li>
					<li className="debut-item">
						<a href="">
							<h2>fds</h2>
							<div className="debut-board">
								<Chessboard />
							</div>
						</a>
					</li>
					<li className="debut-item">
						<a href="">
							<h2>fds</h2>
							<div className="debut-board">
								<Chessboard />
							</div>
						</a>
					</li>
					<li className="debut-item">
						<a href="">
							<h2>fds</h2>
							<div className="debut-board">
								<Chessboard />
							</div>
						</a>
					</li>
					<li className="debut-item">
						<a href="">
							<h2>fds</h2>
							<div className="debut-board">
								<Chessboard />
							</div>
						</a>
					</li>
					<li className="debut-item">
						<a href="">
							<h2>fds</h2>
							<div className="debut-board">
								<Chessboard />
							</div>
						</a>
					</li>
				</ul>
			</div>
		);
	}
}

export default Debut;
