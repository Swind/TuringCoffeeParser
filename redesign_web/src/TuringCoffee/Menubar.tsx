import * as React from "react";
import * as ReactDOM from "react-dom";
import { history } from "../history";

const Sidebar = require("grommet/components/Sidebar");
const Box = require("grommet/components/Box");
const Button = require("grommet/components/Button");
const Header = require("grommet/components/Header");
const Title = require("grommet/components/Title");
const Menu = require("grommet/components/Menu");
const Anchor = require("grommet/components/Anchor");

const CloseIcon = require("grommet/components/icons/base/Close");

interface StateProps extends React.Props<any> {}

type MenubarProps = StateProps;

export default class Menubar extends React.Component<MenubarProps, any> {
  private goToCookbook(): void {
    history.push("/");
  }

  private goToMonitor(): void {
    history.push("/monitor");
  }

  render() {
    return (
      <Header colorIndex="neutral-1" fixed={true} float={false} size="small">
        <Title pad="medium">Coffee</Title>
        <Box flex="grow" direction="row" justify="start">
          <Box pad="small">
            <Anchor onClick={this.goToCookbook}>Cookbook</Anchor>
          </Box>
          <Box pad="small">
            <Anchor onClick={this.goToMonitor}>Monitor</Anchor>
          </Box>
        </Box>
      </Header>
    );
  }
}
