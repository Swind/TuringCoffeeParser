import * as React from "react";
import * as ReactDOM from "react-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { getCookbook, saveCookbook } from "../Api/apiDuck";
import { CookbookParams, Cookbook, Process } from "../Api/cookbook";

import { modifyCookbook, closeNotification } from "./CookbookEditorDuck";

import Loading from "../components/Loading";
import ProcessTable from "./ProcessTable";

import { history } from "../history";

const Box = require("grommet/components/Box");
const Button = require("grommet/components/Button");
const Form = require("grommet/components/Form");
const Toast = require("grommet/components/Toast");
const FormField = require("grommet/components/FormField");
const TextInput = require("grommet/components/TextInput");
const SaveIcon = require("grommet/components/icons/base/Save");
const CloseIcon = require("grommet/components/icons/base/Close");

interface StateProps {
  match?: { params: { id: string } };
  cookbookParams: CookbookParams | null;
  notify: {
    status: string | null;
    result: string | null;
  } | null;
  loading: boolean;
  result: boolean;
}

interface DispatchProps {
  getCookbook(id: string): void;
  saveCookbook(cookbookParams: CookbookParams): void;
  modifyCookbook(cookbookParams: CookbookParams): void;
  closeNotification(): void;
}

type CookbookEditorProps = StateProps & DispatchProps;

function mapStateToProps(state: any): StateProps {
  return {
    loading: state.cookbookEditor.loading,
    result: state.cookbookEditor.result,
    cookbookParams: state.cookbookEditor.cookbookParams,
    notify: state.cookbookEditor.notify
  };
}

function mapDispatchToProps(dispatch: any) {
  return bindActionCreators(
    {
      getCookbook: getCookbook.request,
      saveCookbook: saveCookbook.request,
      modifyCookbook: modifyCookbook,
      closeNotification: closeNotification
    },
    dispatch
  );
}

class CookbookEditor extends React.Component<
  CookbookEditorProps,
  any
> {
  constructor(props: CookbookEditorProps) {
    super(props);
    this.closeToast = this.closeToast.bind(this);
    this.changeCookbookName = this.changeCookbookName.bind(this);
    this.changeCookbookDescription = this.changeCookbookDescription.bind(this);
    this.changeCookbookProcesses = this.changeCookbookProcesses.bind(this);
    this.saveCookbook = this.saveCookbook.bind(this);
    this.exit = this.exit.bind(this);
    this.cloneCookbook = this.cloneCookbook.bind(this);
  }

  componentDidMount?() {
    if (this.props.match) {
      const { id } = this.props.match.params;
      this.props.getCookbook(id);
    }
  }

  componentWillUnmount?() {
    this.props.closeNotification();
  }

  private cloneCookbook(): CookbookParams {
    let copyCookbook;
    if (this.state !== null) {
      copyCookbook = Object.assign({}, this.state.cookbookParams);
    } else {
      copyCookbook = Object.assign({}, this.props.cookbookParams);
    }
    return copyCookbook;
  }

  private changeCookbookName(e: any): void {
    let cookbook = this.cloneCookbook();
    cookbook.name = e.target.value;
    this.setState({ cookbookParams: cookbook });
  }

  private changeCookbookDescription(e: any): void {
    let cookbook = this.cloneCookbook();
    cookbook.description = e.target.value;
    this.setState({ cookbookParams: cookbook });
  }

  private changeCookbookProcesses(processes: Array<Process>): void {
    let cookbook = this.cloneCookbook();
    cookbook.processes = processes;
    this.setState({ cookbookParams: cookbook });
  }

  private saveCookbook(e: any): void {
    if (this.state !== null) {
      this.props.saveCookbook(this.state.cookbookParams);
    } else {
      if (this.props.cookbookParams) {
        this.props.saveCookbook(this.props.cookbookParams);
      }
    }
  }

  private exit(e: any): void {
    history.push("/");
  }

  private closeToast(e: any): void {
    this.props.closeNotification();
  }

  render(): JSX.Element | null {
    const { notify, loading, result } = this.props;
    if (loading) {
      return <div>Loading ... </div>;
    } else if (result == false) {
      return <div>Load failed</div>;
    }

    const cookbookParams = this.state
      ? this.state.cookbookParams
      : this.props.cookbookParams;
    if (cookbookParams === null) {
      return <div>Cannot find this cookbookParams</div>;
    }

    const cookbook = new Cookbook(cookbookParams);
    return (
      <Box pad="small">
        {notify &&
          <Toast status={notify.status} onClose={this.closeToast}>
            {notify.result}
          </Toast>}
        <Form plain={true}>
          <FormField label="Cookbook Name">
            <TextInput
              id="CookbookName"
              value={
                this.state && this.state.cookbook
                  ? this.state.cookbook.name
                  : cookbook.name
              }
              placeHolder="Cookbook Name ..."
              onDOMChange={this.changeCookbookName}
            />
          </FormField>
          <FormField label="Cookbook Description">
            <TextInput
              id="CookbookDescription"
              value={
                this.state && this.state.cookbook
                  ? this.state.cookbookParams.description
                  : cookbook.description
              }
              placeHolder="Cookbook Description ..."
              onDOMChange={this.changeCookbookDescription}
            />
          </FormField>
        </Form>
        <ProcessTable
          processes={cookbook.processes}
          onChange={this.changeCookbookProcesses}
        />
        <div>
          <Button
            icon={<SaveIcon />}
            label="Save"
            onClick={this.saveCookbook}
          />
          <Button
            icon={<CloseIcon />}
            label="Exit"
            onClick={this.exit}
          />
        </div>
      </Box>
    );
  }
}

export default connect<StateProps, DispatchProps, any>(
  mapStateToProps,
  mapDispatchToProps
)(CookbookEditor);
