import React from 'react'
import LoadingIcon from './LoadingIcon'
import './styles.less'

const Loading = ({...props}) => {
  return (
    <>
      <div className="loading" {...props}>
        <LoadingIcon className="loading-icon" />
      </div>
    </>
  )
}

export default Loading
