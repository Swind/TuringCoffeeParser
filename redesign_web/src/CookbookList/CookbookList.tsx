import * as React from "react";
import * as ReactDOM from "react-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { listCookbooks, brewCookbook } from "../Api/apiDuck";
import { Cookbook } from "../Api/cookbook";
import { history } from "../history";
import {
  openNewCookbookDialog,
  closeNewCookbookDialog,
  closeBrewNotify,
  changeSearchCookbookKeyword
} from "./CookbookListDuck";

import CookbookCard from "./CookbookCard";

const Box = require("grommet/components/Box");
const Columns = require("grommet/components/Columns");
const SearchInput = require("grommet/components/SearchInput");
const Search = require("grommet/components/Search");
const Toast = require("grommet/components/Toast");

interface StateProps {
  notify: {
    open: boolean;
    status: string;
    message: string;
  };
  loading: boolean;
  result: boolean;
  newCookbookDialogOpen: boolean;
  cookbooks: Array<Cookbook>;
  searchKey: String;
}

interface DispatchProps {
  listCookbooks(): void;
  brewCookbook(): void;
  changeSearchCookbookKeyword(keyword: string): void;
  closeBrewNotify(): void;
}

type CookbookListProps = StateProps & DispatchProps;

function mapStateToProps(state: any): StateProps {
  return {
    loading: state.cookbookList.loading,
    result: state.cookbookList.result,
    newCookbookDialogOpen: state.cookbookList.newCookbookDialogOpen,
    cookbooks: state.cookbookList.cookbooks,
    searchKey: state.cookbookList.searchKey,
    notify: state.cookbookList.notify
  };
}

function mapDispatchToProps(dispatch: any) {
  return bindActionCreators(
    {
      listCookbooks: listCookbooks.request,
      brewCookbook: brewCookbook.request,
      changeSearchCookbookKeyword: changeSearchCookbookKeyword,
      closeBrewNotify: closeBrewNotify
    },
    dispatch
  );
}

class CookbookList extends React.Component<CookbookListProps, any> {
  componentDidMount() {
    this.props.listCookbooks();
  }

  render(): JSX.Element | null {
    const filterListedCookbooks = (e: any) => {
      this.props.changeSearchCookbookKeyword(e.target.value);
    };

    const { cookbooks, searchKey } = this.props;
    const cookbookCards = cookbooks
      .filter((v: Cookbook) => {
        return v.name.toLowerCase().match(searchKey.toLowerCase()) != null;
      })
      .map((v: Cookbook) => {
        const doBrew = () => {
          this.props.brewCookbook();
        };
        const gotoEdit = () => {
          history.push(`/edit/${v.id}`);
        };

        return (
          <CookbookCard
            key={v.id}
            cookbook={v}
            onBrew={doBrew}
            onEdit={gotoEdit}
          />
        );
      });

    return (
      <Box colorIndex="light-1">
        {this.props.notify.open &&
          <Toast
            status={this.props.notify.status}
            onClose={this.props.closeBrewNotify}
          >
            {this.props.notify.message}
          </Toast>
        }
        <Search
          placeHolder="Search cookbooks ... "
          inline={true}
          iconAlign="start"
          value={searchKey}
          onDOMChange={filterListedCookbooks}
        />
        {cookbookCards}
      </Box>
    );
  }
}

export default connect<StateProps, DispatchProps, any>(
  mapStateToProps,
  mapDispatchToProps
)(CookbookList);
