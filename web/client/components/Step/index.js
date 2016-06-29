import React, { Component } from 'react'
import FlatButton from 'material-ui/FlatButton'
import style from './style.css'

class Step extends Component {
  render() {
    const {id, title, children, onDelete} = this.props

    return (
      <div className={style.stepContainer}>
        <div className={style.step}>
          <div>
            <div className={style.circle}>{id}</div>
            <div className={style.line}></div>
          </div>
          <div>
            <div className={style.title}>
              {title}
              <a onClick={onDelete}>
                <FlatButton label="DELETE" labelPosition="before" secondary={true}>
                </FlatButton>
              </a>
            </div>
            {children}
          </div>
        </div>
      </div>
    )
  }
}

export default Step
