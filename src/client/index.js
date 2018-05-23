import { Route, Router } from 'react-router-dom';

import App from './App'
import React from 'react';
import ReactDOM from 'react-dom';

let history;
if (typeof window !== 'undefined') {
    const createBrowserHistory = require('history/createBrowserHistory').default;
    history = createBrowserHistory()
}

ReactDOM.render(
    <Router history={history}>
        <div>
            <Route exact path="/" component={App} />
            <Route path="/app" component={App} />
        </div>
    </Router>
    , document.getElementById('root')
);
