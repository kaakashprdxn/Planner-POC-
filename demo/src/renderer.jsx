import React from 'react';
import ReactDOM from 'react-dom';
import ContainerDimensions from 'react-container-dimensions';
import Immutable, {Map} from 'immutable';
import immutableDevtools from 'immutable-devtools';
import {createStore} from 'redux';
import {Provider} from 'react-redux';

import MyCatalog from './catalog/mycatalog';

import ToolbarScreenshotButton from './ui/toolbar-screenshot-button';

import {
  Models as PlannerModels,
  reducer as PlannerReducer,
  ReactPlanner,
  Plugins as PlannerPlugins,
} from 'react-planner'; //react-planner

//define state
let AppState = Map({
  'react-planner': new PlannerModels.State()
});

//define reducer
let reducer = (state, action) => {
  state = state || AppState;
  state = state.update('react-planner', plannerState => PlannerReducer(plannerState, action));
  return state;
};

let blackList = isProduction === true ? [] : [
  'UPDATE_MOUSE_COORDS',
  'UPDATE_ZOOM_SCALE',
  'UPDATE_2D_CAMERA'
];

if( !isProduction ) {
  console.info('Environment is in development and these actions will be blacklisted', blackList);
  console.info('Enable Chrome custom formatter for Immutable pretty print');
  immutableDevtools( Immutable );
}

//init store
let store = createStore(
  reducer,
  null,
  !isProduction && window.devToolsExtension ?
    window.devToolsExtension({
      actionsBlacklist: blackList,
      maxAge: 999999
    }) :
    f => f
);

let plugins = [
  PlannerPlugins.Keyboard(),
  PlannerPlugins.Autosave('react-planner_v0'),
  PlannerPlugins.ConsoleDebugger(),
];

let toolbarButtons = [
  ToolbarScreenshotButton,
];

//render
ReactDOM.render(
  (
    <Provider store={store}>
      <ContainerDimensions>
        {({width, height}) =>
          <ReactPlanner
            catalog={MyCatalog}
            width={width}
            height={height}
            plugins={plugins}
            toolbarButtons={toolbarButtons}
            stateExtractor={state => state.get('react-planner')}
          />
        }
      </ContainerDimensions>
    </Provider>
  ),
  document.getElementById('app')
);

