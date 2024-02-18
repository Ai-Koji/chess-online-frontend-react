import React from 'react';
import { Navigate } from 'react-router-dom';
import '../styles/login-reg.css';

class Reg extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isNavigate: false,
			status: {
				message: null,
				statusCode: null
			}
		};
	}

	Status = () => {
		if (
			this.state.status.statusCode === 400 ||
			this.state.status.statusCode === 500
		) {
			return (
				<div className="status status-error">{this.state.status.message}</div>
			);
		}
	};

	register = (event) => {
		event.preventDefault();

		const form = document.getElementById('form');
		let formData = new FormData(form);

		fetch('/api/auth/register', {
			method: 'POST',
			body: formData
		})
			.then((response) => {
				if (response.status === 200) {
					this.setState({
						isNavigate: true
					});
				} else if (response.status === 400) {
					switch (response.statusText) {
						case 'missing meaning':
							this.setState({
								status: {
									message: 'Заполните пропущенное поле',
									statusCode: 400
								}
							});
							break;
						case 'login is already in use':
							this.setState({
								status: {
									message: 'Логин занят',
									statusCode: 400
								}
							});
							break;
						case 'email is already in use':
							this.setState({
								status: {
									message: 'Почта занята',
									statusCode: 400
								}
							});
							break;
						default:
						//
					}
				} else if (response.statusText === 500) {
					this.setState({
						status: {
							message:
								'Ошибка со стороны сервера, попробуйте позже или свяжитесь с администраторами',
							statusCode: 500
						}
					});
				}
			})
			.catch((error) => {
				this.setState({
					status: {
						message: 'Произошла ошибка при отправке запроса, попробуйте позже',
						statusCode: 500
					}
				});
			});
	};

	render() {
		if (this.state.isNavigate) return <Navigate to="/board" />;

		return (
			<div className="container">
				<div className="form">
					<form id="form" onSubmit={this.register}>
						<h1>Регистрация</h1>
						<label>Логин</label>
						<input name="login" />
						<label>Пароль</label>
						<input name="password" />
						<label>Электронная почта</label>
						<input name="email" />
						<input type="submit" value="зарегистрироваться" />
					</form>
					<div className="urls">
						<a href="/auth/login">Авторизация</a>
					</div>
					<this.Status />
				</div>
			</div>
		);
	}
}

export default Reg;
