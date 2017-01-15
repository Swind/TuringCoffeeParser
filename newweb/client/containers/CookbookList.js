import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'

import {
  brewCookbook,
  closeCopyCookbookDialog,
  closeDeleteCookbookDialog,
  closeNewCookbookDialog,
  copyCookbook,
  deleteCookbook,
  listCookbook,
  openCopyCookbookDialog,
  openDeleteCookbookDialog,
  openNewCookbookDialog,
  saveNewCookbook
} from '../actions/cookbook'

import CookbookCard from '../components/CookbookCard'
import NewCookbookDialog from '../components/NewCookbookDialog'
import DeleteCookbookDialog from '../components/DeleteCookbookDialog'

class CookbookList extends Component {

  componentDidMount() {
    this.props.dispatch(listCookbook.request())
  }

  createCookbook(cookbook) {
    const onEdit = () => {
      this.props.dispatch(push(`/editor/${cookbook._id}`))
    }
    const onBrew = () => {
      this.props.dispatch(brewCookbook.request(cookbook._id))
    }
    const onCopy = () => {
      this.props.dispatch(copyCookbook.request(cookbook._id))
    }
    const onDelete = () => {
      this.props.dispatch(openDeleteCookbookDialog(cookbook))
    }

    return (
      <CookbookCard
        key={cookbook._id}
        title={cookbook.name}
        subtitle={cookbook.description}
        onEdit={onEdit}
        onBrew={onBrew}
        onCopy={onCopy}
        onDelete={onDelete}
      />
    )
  }

  openNewCookbookDialog() {
    this.props.dispatch(openNewCookbookDialog())
  }

  closeNewCookbookDialog() {
    this.props.dispatch(closeNewCookbookDialog())
  }

  saveNewCookbook(name, description) {
    this.props.dispatch(saveNewCookbook.request(name, description))
  }

  closeCopyCookbookDialog() {
    this.props.dispatch(closeCopyCookbookDialog())
  }

  deleteCookbook() {
    this.props.dispatch(deleteCookbook.request(this.props.cookbook.toBeDeletedCookbook._id))
  }

  closeDeleteCookbookDialog() {
    this.props.dispatch(closeDeleteCookbookDialog())
  }

  loadingRender() {
    return (<div>Loading cookbooks ...</div>)
  }

  loadedRender() {
    const {
      cookbooks,
      newCookbookDialogOpen,
      copyCookbookDialogOpen,
      deleteCookbookDialogOpen,
      toBeDeletedCookbook
    } = this.props.cookbook
    cookbooks.sort((a, b) => a.name.localeCompare(b.name))

    const cookbookCards = cookbooks.map((cookbook) => {
      return this.createCookbook(cookbook)
    })

    return (
      <div>
        {cookbookCards}
        <FloatingActionButton
          onTouchTap={this.openNewCookbookDialog.bind(this)}
          style={{
            position: 'fixed',
            right: '50px',
            bottom: '50px'
          }}
        >
          <ContentAdd />
        </FloatingActionButton>
        <NewCookbookDialog
          open={newCookbookDialogOpen}
          onSubmit={this.saveNewCookbook.bind(this)}
          onCancel={this.closeNewCookbookDialog.bind(this)}
        />
        <DeleteCookbookDialog
          open={deleteCookbookDialogOpen}
          onSubmit={this.deleteCookbook.bind(this)}
          onCancel={this.closeDeleteCookbookDialog.bind(this)}
          name={(toBeDeletedCookbook)? toBeDeletedCookbook.name: ''}
        />
      </div>
    )
  }

  render() {
    const { loading } = this.props.cookbook

    if (loading) {
      return this.loadingRender()
    } else {
      return this.loadedRender()
    }
  }
}

function mapStateToProps(state) {
  return {
    cookbook: state.cookbook
  }
}

export default connect(
  mapStateToProps
)(CookbookList)
