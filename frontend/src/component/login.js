import React from 'react';
import { Navigate } from 'react-router-dom';
import '../styles/login-reg.css';

class Login extends React.Component {
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
			this.state.status.statusCode === 401 ||
			this.state.status.statusCode === 500
		) {
			return (
				<div className="status status-error">{this.state.status.message}</div>
			);
		}
	};

	login = (event) => {
		event.preventDefault();

		const form = document.getElementById('form');
		let formData = new FormData(form);

		fetch('/api/auth/login', {
			method: 'POST',
			body: formData
		})
			.then((response) => {
				if (response.status === 200) {
					this.setState({
						isNavigate: true
					});
				} else if (response.status === 400) {
					this.setState({
						status: {
							message: 'Заполните пропущенное поле',
							statusCode: 400
						}
					});
				} else if (response.status === 401) {
					switch (response.statusText) {
						case 'invalid password':
							this.setState({
								status: {
									message: 'Неверный пароль',
									statusCode: 401
								}
							});
							break;
						case 'account not found':
							this.setState({
								status: {
									message: 'Аккаунт не найден',
									statusCode: 401
								}
							});
							break;
						default:
						//
					}
				} else if (response.status === 500) {
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
						message: `Произошла ошибка при отправке запроса, попробуйте позже 
                        ошибка: ${error}`,
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
					<form id="form" onSubmit={this.login}>
						<h1>Войти</h1>
						<label>Логин или электронная почта</label>
						<input name="loginOrMail" />
						<label>Пароль</label>
						<input name="password" />
						<input type="submit" value="Войти" />
					</form>
					<div className="urls">
						<a href="/auth/registration">Регистрация</a>
					</div>
					<this.Status />
				</div>
			</div>
		);
	}
}

export default Login;
