import * as React from "react";
import * as ReactDOM from "react-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Route } from "react-router";

import Menubar from "./Menubar";
import CookbookList from "../CookbookList/CookbookList";
import CookbookEditor from "../CookbookEditor/CookbookEditor";
import Monitor from "../Monitor/Monitor";

const App = require("grommet/components/App");
const Split = require("grommet/components/Split");
const Box = require("grommet/components/Box");

interface StateProps {}

function mapStateToProps(state: any) {
  return {};
}

function mapDispatchToProps(dispatch: any) {
  return bindActionCreators({}, dispatch);
}

class TuringCoffee extends React.Component<StateProps, any> {
  render() {
    const { children } = this.props;
    return (
      <App centered={false}>
        <Menubar />
        <Box>
          <Route path="/edit/:id" component={CookbookEditor} />
          <Route path="/monitor" component={Monitor} />
          <Route exact path="/" component={CookbookList} />
        </Box>
      </App>
    );
  }
}

export default connect<StateProps, null, any>(mapStateToProps, mapDispatchToProps)(TuringCoffee);
