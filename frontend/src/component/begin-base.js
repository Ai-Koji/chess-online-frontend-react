import React from 'react';
import '../styles/begin-base.css';
import { Chessboard } from 'react-chessboard';

class BeginBase extends React.Component {
	// add fetch
	getLessonsList() {
		// here will be fetch, witch will get save from server
		return [];
	}

	LessonsList() {
		// {url, name, FEN, RGB}
		let lessons = [];
		lessons = this.getLessonsList();

		let elements = [];
		for (let index = 0; index < lessons.length; index++) {
			elements.push(
				<a href={lessons[index].url} className="lesson-card">
					<img className="lesson-logo" src={lessons[index].imagePath} alt="" />
					<div className="lesson-text">
						<h2>{lessons[index].name}</h2>
						<p>{lessons[index].about}</p>
					</div>
				</a>
			);
		}

		return elements;
	}

	render() {
		return (
			<div className="container">
				<div className="lesson-blocks">
					<h1>Шахматные фигуры</h1>
					<div className="lesson-list">{this.LessonsList()}</div>
				</div>
			</div>
		);
	}
}

export default BeginBase;
