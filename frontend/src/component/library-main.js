import React from 'react';
import '../styles/library-main.css';

class Library extends React.Component {
	// books: [{id, header, bookList: [{id, title, author, imageUrl}]}]
	constructor(props) {
		super(props);
		this.state = {
			books: []
		};
	}

	getBooks = () => {
		fetch('/api/library/main', { method: 'GET' })
			.then((response) => response.json())
			.then((result) => {
				this.setState({ books: result });
			})
			.catch((result) => {
				console.log(result);
			});
	};

	componentDidMount() {
		this.getBooks();
	}

	Books(blockIndex) {
		let books = [];
		for (
			let index = 0;
			index < this.state.books[blockIndex].bookList.length;
			index++
		) {
			books.push(
				<a className="book" href={`/library/book/${this.state.books[blockIndex].bookList[index].id}`} key={index}>
					<img
						src={this.state.books[blockIndex].bookList[index].imageUrl}
						alt=""
					/>
					<div className="name-and-author">
						<h5>{this.state.books[blockIndex].bookList[index].title}</h5>
						<h6>{this.state.books[blockIndex].bookList[index].author}</h6>
					</div>
				</a>
			);
		}
		return books;
	}

	BookBlocks() {
		let bookBlocks = [];

		for (let index = 0; index < this.state.books.length; index++) {
			bookBlocks.push(
				<div className="content-block" key={index}>
					<h3>{this.state.books[index].header}</h3>
					<div className="books">{this.Books(index)}</div>
					{/* <button className="showMore">показать еще</button> */}
				</div>
			);
		}
		return bookBlocks;
	}

	render() {
		return (
			<div className="container" style={{ display: 'block' }}>
				<div className="header">
					<h1>Шахматная Библия</h1>
					{/* <input placeholder="Поиск" className="search-input" /> */}
				</div>
				<div className="content">{this.BookBlocks()}</div>
			</div>
		);
	}
}

export default Library;
