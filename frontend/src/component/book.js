import React from 'react';
import '../styles/library-book.css';

class Book extends React.Component {
	render() {
		return (
			<div className="container" style={{ display: 'block' }}>
				<div className="content">
                    <div className="image">
                        <img src={"https://i3.mybook.io/p/x378/book_covers/06/83/0683b0e6-5204-48ed-9dac-d62cb80fb27a.jpg"}/>
                    </div>
                    <div className="about-book">
                        <h1>Руководство богатого папы по инвестированию</h1>
                        <h6 className="author">Роберт Кийосаки</h6>
                        <h3>О книге</h3>
                        <p>Вопросы социальной психологии, активной жизненной позиции человека, социологии финансов складываются в генеральную тему, к которой автор обращался неоднократно – в книгах «Богатый папа, бедный папа» и «Квадрант денежного потока», уже знакомых широкому кругу читателей.

                            Для широкого круга читателей.

                            читайте онлайн полную версию книги «Руководство богатого папы по инвестированию» автора Роберт Кийосаки на сайте электронной библиотеки MyBook.ru. Скачивайте приложения для iOS или Android и читайте «Руководство богатого папы по инвестированию» где угодно даже без интернета. 
                        </p>
                        <a className="read-pdf cant-read">Читать бесплатно</a>
                        <div className='where-to-buy'>
                            <h3>Где купить:</h3>
                                <a href="">Wildberries</a>
                        </div>
                    </div>
                </div>
			</div>
		);
	}
}

export default Book;
