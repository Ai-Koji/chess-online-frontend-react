import React from 'react';
import '../styles/lessons-main.css';

class Lessons extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			lessonsBlocks: null
		};
	}

	cards = (block_id, info) => {
		let body = [];
		for (let index = 0; index < info.length; index++) {
			if (info[index].block_id == block_id)
				body.push(
					<a
						href={`/beginner-lessons/lesson/${info[index].lesson_id}`}
						className="card"
					>
						{info[index].lesson_image != null ? (
							<img src={info[index].lesson_image} />
						) : (
							''
						)}
						<div
							className={
								info[index].lesson_image != null
									? 'header'
									: 'header without_image'
							}
						>
							<h3>{info[index].lesson_header}</h3>
							<p>{info[index].lesson_about}</p>
						</div>
					</a>
				);
		}
		return body;
	};

	getInfo = () => {
		let body = [];
		fetch('/api/lessons/main')
			.then((response) => response.json())
			.then((result) => {
				let blocks = [];
				let usedBlocks = [];
				for (let index = 0; index < result.length; index++) {
					if (usedBlocks.indexOf(result[index].block_id) === -1) {
						usedBlocks.push(result[index].block_id);
						blocks.push({
							id: result[index].block_id,
							header: result[index].block_header
						});
					}
				}

				for (let index = 0; index < blocks.length; index++) {
					body.push(
						<div className="lessons-block">
							<h2>{blocks[index].header}</h2>
							<div className="cards">
								{this.cards(blocks[index].id, result)}
							</div>
						</div>
					);
				}

				this.setState({ lessonsBlocks: body });
			})
			.catch((err) => {
				console.log(err);
			});
	};

	componentDidMount() {
		this.getInfo();
	}

	render() {
		return (
			<div className="container" style={{ display: 'block' }}>
				<div className="header">
					<h1>Для начинающих</h1>
				</div>
				<div className="content">{this.state.lessonsBlocks}</div>
			</div>
		);
	}
}

export default Lessons;
