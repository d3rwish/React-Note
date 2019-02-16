import React, { Component } from 'react';

import './Auth.css';
import AuthContext from '../context/auth-context';

class AuthPage extends Component {
    state = {
        loginMode: true,
        errStatus: false,
        msgStatus: false
    };
    msg = null;
    errorMsg = null;

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.emailElement = React.createRef();
        this.passwordElement = React.createRef();
    }

    switchModeHandler = () => {
        this.setState({errStatus: false});
        this.setState({msgStatus: false});
        this.errorMsg = null;
        this.msg = null;
        this.setState(prevState => {
            return {loginMode: !prevState.loginMode};
        })
    }

    submitHandler = event => {
        event.preventDefault();
        this.setState({errStatus: false});
        this.setState({msgStatus: false});

        let requestBody

        if (!this.state.loginMode) {
            const email = this.emailElement.current.value;
            const password = this.passwordElement.current.value;
    
            if (email.trim().length === 0 || password.trim().length === 0 ) {
                this.errorMsg =  "Fill in the fields";
                this.setState({errStatus: true});
                return;
            }

            requestBody = {
                query:`
                    mutation {
                        createUser(userInput: {email: "${email}", password: "${password}"}) {
                            _id
                            email
                            signUpDate
                        }
                    }
                `
            };

        } else {
            const email = this.emailElement.current.value;
            const password = this.passwordElement.current.value;

            if (email.trim().length === 0 || password.trim().length === 0 ) {
                this.errorMsg =  "Fill in the fields";
                this.setState({errStatus: true});
                return;
            }

            requestBody = {
                query:`
                    query {
                        login(email: "${email}", password: "${password}") {
                            userId
                            userToken
                            userTokenExp
                        }
                    }
                `
            };
        }

        fetch('http://localhost:8140/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }

            return res.json();
        })
        .then(resData => {
            if (resData.errors) {
                this.errorMsg = resData.errors[0].message;
                this.setState({errStatus: true});
                return;
            }
            else if (resData.data.createUser) {

                console.log(resData.data.createUser);
                this.msg = "User created. Please login"
                this.setState({msgStatus: true });
                return;
            }
            if (resData.data.login.userToken) {
                this.context.login(
                    resData.data.login.userToken, 
                    resData.data.login.userId, 
                    resData.data.login.userTokenExp
                );
            }
        })
        .catch(err => {
            this.errorMsg =  "Failed to Connect try again";
            this.setState({errStatus: true});
            console.log(err);
        });
    };

    render() {
        if (this.state.loginMode) {
            return (
                <React.Fragment>
                    <form className="auth-form" onSubmit={this.submitHandler}>
                        <div className="auth-label">
                            <h1>Login</h1>
                        </div>
                        <div className="form-control">
                            <label htmlFor="email">E-mail</label>
                            <input type="email" id="email" ref={this.emailElement}></input>
                        </div>
                        <div className="form-control">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" ref={this.passwordElement}></input>
                        </div>
                        <div className="form-action">
                            <button type="submit">Submit</button>
                            <button type="button" onClick={this.switchModeHandler}>
                                {this.state.loginMode ? 'SignUp' : 'Login'}
                            </button>
                        </div>
                    </form>
                    {(this.state.errStatus || this.state.msgStatus ) && <div className= {this.state.errStatus ? ("auth-error") : ("auth-msg")}>
                        <div className= {this.state.errStatus ? ("auth-error-msg") : ("auth-msg-message")}>
                            <p>{this.state.errStatus ? (this.errorMsg) : (this.msg)}</p>
                        </div>
                    </div>}
                </React.Fragment>
            )
        }
        return (
            <React.Fragment>
                <form className="auth-form" onSubmit={this.submitHandler}>
                    <div className="auth-label">
                        <h1>SignUp</h1>
                    </div>
                    <div className="form-control">
                        <label htmlFor="email">E-mail</label>
                        <input type="email" id="email" ref={this.emailElement}></input>
                    </div>
                    <div className="form-control">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" ref={this.passwordElement}></input>
                    </div>
                    <div className="form-action">
                        <button type="submit">Submit</button>
                        <button type="button" onClick={this.switchModeHandler}>
                            {this.state.loginMode ? 'SignUp' : 'Login'}
                        </button>
                    </div>
                </form>
                {(this.state.errStatus || this.state.msgStatus ) && <div className= {this.state.errStatus ? ("auth-error") : ("auth-msg")}>
                    <div className= {this.state.errStatus ? ("auth-error-msg") : ("auth-msg-message")}>
                        <p>{this.state.errStatus ? (this.errorMsg) : (this.msg)}</p>
                    </div>
                </div>}
            </React.Fragment>
        )
    }
}

export default AuthPage;