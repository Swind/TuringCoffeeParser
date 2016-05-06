/**
 * In this file, we create a React component
 * which incorporates components providedby material-ui.
 */

import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import {deepOrange500} from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import ReactGridLayout from 'react-grid-layout'

import Header from '../../components/Header';
import CookbookList from '../CookbookList';

var layout = [
  {i: 'Header', x: 0, y: 0, w: 1, h: 2, static: true},
  {i: 'CookbookList', x: 1, y: 0, w:1, h:1}
];

const styles = {
  container: {
    textAlign: 'center',
    paddingTop: 200,
  },
};

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
  },
});

class Main extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <ReactGridLayout className='layout' layout={layout} cols={12} rowHeight={30} width={1200}>
          <Header key={'Header'}/>
          <CookbookList key={'CookbookList'}/>
        </ReactGridLayout>
      </MuiThemeProvider>
    );
  }
}

export default Main;
