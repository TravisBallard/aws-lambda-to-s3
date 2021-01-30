import React from 'react'
import get from 'lodash/get'
import './styles.less'

const FileInput = ({...props}) => {
  props = {...props, className: 'file-input ' + get(props, 'className', '')}

  const forwardRef = get(props, 'forwardRef', null)
  if (forwardRef) { delete props.forwardRef }

  return (
    <>
      <input type="file" {...props} ref={forwardRef} />
    </>
  )
}

export default FileInput
