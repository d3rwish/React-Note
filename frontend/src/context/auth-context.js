import React from 'react';

export default React.createContext({
    userToken: null,
    userId: null,
    userTokenExp: null,
    login: (userToken, userId, userTokenExp) => {},
    logout: () => {}
});