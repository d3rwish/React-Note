import React from 'react';
import { NavLink } from 'react-router-dom';

import AuthContext from '../../context/auth-context';
import './MainNavigation.css';


const mainNavigation = props => (
    <AuthContext.Consumer>
        {context => {
            return (
                <header className="main-nav">
                    <div className="main-nav__logo">
                        <h1>NOTES <span>Vault</span></h1>
                    </div>
                    <nav className="main-nav__items">
                            {!context.userToken && (
								<ul>
									<li>
										<NavLink to="/auth">Login to Vault</NavLink>
									</li>
								</ul>
							)}
							{context.userToken && (
								<ul>
									<li>
										<NavLink to="/notes">Notes</NavLink>
									</li>
									<li>
										<NavLink to="/user">User</NavLink>
									</li>
									<li>
										<button onClick={context.logout}>Logout</button>
									</li>
								</ul>
							)}
                    </nav>
                </header>
            )
        }}
    </AuthContext.Consumer>
);

export default mainNavigation;