# Pages, Store, Actions and Sagas

# Pages
PersonalAmbitionPage
AmbitionOverviewPage
AmbitionPage
PersonalAmbitionLogActionPage

# Store
AmbitionHeaders
PersonalAmbitions
User


## ACTION: FETCH_AMBITION_HEADERS 
Sagas
fetchAmbitionHeadersAsync
watchAmbitionHeaders

## ACTION: FETCH_PERSONAL_AMBITIONS
Sagas
fetchPersonalAmbitionsAsync
watchPersonalAmbition

## ACTION: ADD_PERSONAL_AMBITION
Sagas
addPersonalAmbitionAsync
watchPersonalAmbition

## ACTION: PLUS_ONE_PERSONAL_AMBITION
Sagas
plusOnePersonalAmbitionAsynch
watchPlusOnePersonalAmbition

## ACTION: ADD_LOG_PERSONAL_AMBITION
Sagas
addLogPersonalAmbitionAsynch
watchAddLogPersonalAmbition


### Code structure

index.js
	import App from './app/containers/App';
	AppRegistry.registerComponent('climateambition', () => App);

app/containers/App.js
	import React, { Component } from 'react';
	import {AppState,NetInfo,Platform,} from 'react-native';
	import SplashScreen from 'react-native-splash-screen';
	import { Provider } from 'react-redux';
	import { MenuProvider } from 'react-native-popup-menu';
	import AppNavigator from '../navigation';
	import { setNavigator } from '../navigation/service';
	import store from '../store/config';
	import * as actions from '../store';
	import { isAuthenticated } from '../store/auth'
	render() {
	return (
	  <Provider store={store}>
	    <MenuProvider>
	      <AppNavigator ref={(ref) => { setNavigator(ref); }} />
	    </MenuProvider>
	  </Provider>
	);
	}

store/index.js
	export * from './personal-ambitions/actions';++

store/personal-ambitions/action.js
	import { createAction } from 'redux-actions';
	export const fetchPersonalAmbitions = createAction('PersonalAmbitions/GET');	
store/m2-notifications/index.js
	import * as actions from './actions';

	export {
	  getIsFetching,
	  getPersonalAmbitionsAsList,
	} from './reducer';

	export { actions };

store/personal-ambitions/reducer.js
	import { handleActions } from 'redux-actions';

	import * as actions from './actions';
	import { stateKeys } from '../../types';


	const defaultState = {
	  fetching: false,
	  data: [],
	};

	export default handleActions({
	  [actions.fetchPersonalAmbitionsRequested]: state => ({
	    ...state,
	    fetching: true,
	  }),
	  [actions.fetchPersonalAmbitionsSucceeded]: (state, action) => ({
	    fetching: false,
	    data: action.payload.filter(item => !item.systemStatus.includes('NOCO')),
	  }),
	  [actions.fetchPersonalAmbitionsFailed]: state => ({
	    ...state,
	    fetching: false,
	  }),
	}, defaultState);

	export const getIsFetching = state => state[stateKeys.PERSONALAMBITION].fetching;
store/personal-ambitions/sage.js
		import {
	  put,
	  call,
	  takeLatest,
	} from 'redux-saga/effects';
	import api from '../../services/api';
	import * as actions from './actions';
	import { track, metricKeys } from '../../utils/metrics';
	import handleError from '../../utils/handleNetworkErrors';

	function* fetchPersonalAmbitions(action) {
	  try {
	    yield put(actions.fetchPersonalAmbitionsRequested());
	    track(metricKeys.FETCH_PERSONAL_AMBITIONS_STARTED);
	    const response = yield call(api.getPersonalAmibitions, action.payload);
	    yield put(actions.fetchPersonalAmbitionsSucceeded(response));
	    track(metricKeys.FETCH_PERSONAL_AMBITIONS_SUCCESS);
	  } catch (ex) {
	    yield call(handleError, ex);
	    yield put(actions.fetchPersonalAmbitionsFailed());
	    track(metricKeys.FETCH_PERSONAL_AMBITIONS_FAILED);
	  }
	}


	export default function* watchPersonalAmbitions() {
	  yield takeLatest(actions.fetchPersonalAmbitions.toString(), fetchPersonalAmbitions);
	}

services/api/index.js
	require('./api-methods');
	export default api;

services/api/api-methods.js
	import * as RNFS from 'react-native-fs';
	import _flatMap from 'lodash/flatMap';
	import { Buffer } from 'buffer';
	import { NetworkException } from '../../utils/Exception';
	// Helper functions
	const fetchData = (path, resource = defaultResource) => (
	  authenticateSilently(resource)
	    .then(r =>
	      fetch(createUrl(resource, path), {
	        method: 'GET',
	        withCredentials: true,
	        headers: {
	          ...jsonHeaders,
	          Authorization: `Bearer ${r.accessToken}`,
	        },
	      })
	        .then((response) => {
	          if (response.ok) {
	            return response.json();
	          }
	          throw new NetworkException(response.statusText, response.status);
	        }))
	);
	export function getPersonalAmbitions() {
	  return fetchData(`/path/to/endpoint`);
	}	


