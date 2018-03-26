import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './components/Home';
import Chat from './components/Chat';

export const routes = <Layout>
    <Route exact path='/' component={ Home } />
    <Route path='/chat' component={Chat} />
</Layout>;
