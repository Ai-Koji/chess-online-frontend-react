import React from 'react';
import '../styles/lessons.css';

class Lessons extends React.Component {
	render() {
		return (
			<div className="container" style={{ display: 'block' }}>
				<div className="header">
					<h1>Для начинающих</h1>
				</div>
				<div className="content">
					<div className="lessons-block">
						<h2>Фигуры</h2>
						<div className="cards">
							<a href="" className="card">
								<img src="https://lichess1.org/assets/images/learn/pieces/R.svg" />
								<div className="header">
									<h3>Ладья</h3>
									<p>двигается по линиям</p>
								</div>
							</a>
						</div>
					</div>

					<div className="lessons-block">
						<h2>Фигуры</h2>
						<div className="cards">
							<a href="" className="card">
								<img src="https://lichess1.org/assets/images/learn/pieces/R.svg" />
								<div className="header">
									<h3>Ладья</h3>
									<p>двигается по линиям</p>
								</div>
							</a>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Lessons;
