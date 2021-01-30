import React from 'react'
import UploadToS3 from '@components/UploadToS3'
import './app.less'

const App = () => {
  return (
    <div className="aws-file-upload-example">
      <UploadToS3 />
    </div>
  )
}

export default App
