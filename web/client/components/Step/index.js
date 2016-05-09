import React, { Component } from 'react'
import style from './style.css'

class Step extends Component {
  render() {
    const {id, title, children} = this.props

    return (
      <div className={style.step}>
        <div>
          <div className={style.circle}>{id}</div>
          <div className={style.line}></div>
        </div>
        <div>
          <div className={style.title}>{title}</div>
          {children}
        </div>
      </div>
    )
  }
}

export default Step
