import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './components/Home';
import ChatPage from './components/ChatPage';

export const routes = <Layout>
    <Route exact path='/' component={ Home } />
    <Route path='/chat' component={ChatPage} />
</Layout>;
