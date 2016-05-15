import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import ReactGridLayout, { WidthProvider } from 'react-grid-layout'

import IconButton from 'material-ui/IconButton'
import AddIcon from 'material-ui/svg-icons/content/add'

import CookbookCard from '../../components/CookbookCard';
import * as CookbookActions from '../../actions/cookbooks'

const WidthReactGridLayout = WidthProvider(ReactGridLayout)

const layout = [
  {i: 'Card', x: 0, y: 0, w:12, h:1, isDraggable: false, isResizable: false}
];

class CookbookList extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentWillMount() {
    const {actions} = this.props
    actions.list()
  }

  render() {
    const {cookbooks} = this.props.cookbooks
    return (
      <WidthReactGridLayout className='layout' layout={layout} cols={12}>
        <div key='Card'>
          {cookbooks.map((cookbook, i) => <CookbookCard key={i} title={cookbook.name} subtitle='' href={`/editor/${cookbook._id}`}/>)}
          <IconButton tooltip='Add new cookbook'>
            <AddIcon />
          </IconButton>
        </div>
      </WidthReactGridLayout>
    );
  }
}

function mapStateToProps(state) {
  return {
    cookbooks: state.cookbooks
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(CookbookActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CookbookList)
