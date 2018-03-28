import { createStore, applyMiddleware, compose, combineReducers, GenericStoreEnhancer, Store, StoreEnhancerStoreCreator, ReducersMapObject } from 'redux';
import thunk from 'redux-thunk';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import * as StoreModule from './store';
import { ApplicationState, reducers } from './store';
import { History } from 'history';
import * as SignalR from '@aspnet/signalr-client';

const connection = new SignalR.HubConnection('http://localhost:5000/chatMessage', { transport: SignalR.TransportType.LongPolling });

export function signalRInvokeMiddleware(store: any) {
    return (next: any) => async (action: any) => {
        switch (action.type) {
            case "SIGNALR_SEND_MESSAGE":
                connection.invoke('SendMessage', action.params)
                    .then(() => {
                        action.params.onSuccess();
                    })
                    .catch(function (e) {
                        alert(e);
                    });
                break;
            case "SIGNALR_JOIN_ROOM":
                connection.invoke('JoinGroup', action.params)
                    .then(() => {
                        action.params.onSuccess();
                    })
                    .catch(function (e) {
                        alert(e);
                    });
                break;
            case "SIGNALR_LEAVE_ROOM":
                connection.invoke('LeaveGroup', action.params)
                    .then(() => {
                        action.params.onSuccess();
                    })
                    .catch(function (e) {
                        alert(e);
                    });
                break;
        }

        return next(action);
    }
}

export function signalRRegisterCommands(store: any) {
    connection.on('SendMessage', data => {
        store.dispatch({ type: 'SEND_MESSAGE', params: data })
    });

    connection.start();
}

export default function configureStore(history: History, initialState?: ApplicationState) {
    // Build middleware. These are functions that can process the actions before they reach the store.
    const windowIfDefined = typeof window === 'undefined' ? null : window as any;
    // If devTools is installed, connect to it
    const devToolsExtension = windowIfDefined && windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__ as () => GenericStoreEnhancer;
    const createStoreWithMiddleware = compose(
        applyMiddleware(thunk, routerMiddleware(history), signalRInvokeMiddleware),
        devToolsExtension ? devToolsExtension() : <S>(next: StoreEnhancerStoreCreator<S>) => next
    )(createStore);

    // Combine all reducers and instantiate the app-wide store instance
    const allReducers = buildRootReducer(reducers);
    const store = createStoreWithMiddleware(allReducers, initialState) as Store<ApplicationState>;

    // Enable Webpack hot module replacement for reducers
    if (module.hot) {
        module.hot.accept('./store', () => {
            const nextRootReducer = require<typeof StoreModule>('./store');
            store.replaceReducer(buildRootReducer(nextRootReducer.reducers));
        });
    }

    signalRRegisterCommands(store);

    return store;
}

function buildRootReducer(allReducers: ReducersMapObject) {
    return combineReducers<ApplicationState>(Object.assign({}, allReducers, { routing: routerReducer }));
}

