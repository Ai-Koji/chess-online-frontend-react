import React from 'react';
import '../styles/library-book.css';

class Book extends React.Component {
	constructor(props) {
		const currentUrl = window.location.href;
		const parts = currentUrl.split('/');
		const bookId = parseInt(parts[parts.length - 1]);

		super(props);
		this.state = {
			bookInfo: {},
			bookId: bookId
		};
	}

	getBookInfo = () => {
		fetch(`/api/library/book/${this.state.bookId}`, {
			method: 'GET'
		})
			.then((response) => response.json())
			.then((result) => {
				this.setState({ bookInfo: result[0] });
			})
			.catch((result) => {
				console.log(result);
			});
	};

	componentDidMount() {
		this.getBookInfo();
	}

	whereToBuy = () => {
		let body = [];

		// [{title, url}, {title, url}...]
		let json = this.state.bookInfo.whereToBuy;

		if (json) {
			json = JSON.parse(json);
			for (let index = 0; index < json.length; index++) {
				body.push(<a href={json[index].url}>{json[index].title}</a>);
			}
		}

		return body;
	};

	readPdf = () => {
		if (this.state.bookInfo.pdfUrl) {
			return (
				<a className="read-pdf" href={this.state.bookInfo.pdfUrl} alt="">
					Читать
				</a>
			);
		} else {
			return (
				<a
					className="read-pdf cant-read"
					alt="защищено авторским правом/отсутствует"
				>
					Недоступно
				</a>
			);
		}
	};

	render() {
		return (
			<div className="container" style={{ display: 'block' }}>
				<div className="content">
					<div className="image">
						<img src={this.state.bookInfo.imageUrl} />
					</div>
					<div className="about-book">
						<h1>{this.state.bookInfo.title}</h1>
						<h6 className="author">{this.state.bookInfo.author}</h6>
						<h3>О книге</h3>
						<p>{this.state.bookInfo.about}</p>

						{this.readPdf()}

						<div className="where-to-buy">
							<h3>Где купить:</h3>
							{this.whereToBuy()}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Book;
