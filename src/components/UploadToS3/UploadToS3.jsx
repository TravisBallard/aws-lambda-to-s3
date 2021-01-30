import React, {useState, useRef, useEffect} from 'react'
import FileInput from '@components/FileInput'
import Loading from '../Loading'
import get from 'lodash/get'
import axios from 'axios'
import './styles.less'

/**
 * A form that allows a user to upload a PDF file to our Amazon S3 bucket using a lambda
 * @returns {JSX.Element}
 * @constructor
 */
const UploadToS3 = () => {
  const {SNOWPACK_PUBLIC_UPLOAD_ENDPOINT = ''} = import.meta.env
  const [loading, setLoading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [error, setError] = useState(null)
  const uploadInputRef = useRef(null)

  /**
   * Send a request to lambda for pre-signed url to upload file buffer to
   * @param e
   */
  const handleFormSubmit = e => {
    e.preventDefault()
    const filename = get(uploadInputRef, 'current.files[0]', null)
    if (!filename) return

    setLoading(true)
    setError(null)

    setSelectedFile(get(uploadInputRef, 'current.files[0]', null))

    const reader = new FileReader()

    reader.onloadend = async e => {
      const error = get(e, 'target.error', null)
      const dataUrl = get(e, 'target.result', null)

      if (!error) {
        const dataUrlParts = dataUrl.split(';')
        const dataTypeParts = get(dataUrlParts, '[0]', []).split(':')
        const mimeType = get(dataTypeParts, '[1]', false)

        if (mimeType) {
          if (mimeType.toLowerCase() === 'application/pdf') {
            const result = await axios({
              method: 'GET',
              url: SNOWPACK_PUBLIC_UPLOAD_ENDPOINT,
            })

            const { uploadUrl, pdfFilename } = result.data

            const binary = atob(get(dataUrl.split(','), '[1]', null))

            let array = []
            for (let i = 0; i < binary.length; i++) {
              array.push(binary.charCodeAt(i))
            }

            let blobData = new Blob([new Uint8Array(array)], {
              type: 'application/pdf',
            })

            const parsedUploadUrl = new URL(uploadUrl)

            try {
              const putResult = await axios({
                url: uploadUrl,
                method: 'PUT',
                headers: {
                  'x-amz-acl': parsedUploadUrl.searchParams.get('x-amz-acl'),
                  'x-amz-security-token': parsedUploadUrl.searchParams.get(
                    'x-amz-security-token'
                  ),
                  AWSAccessKeyId: parsedUploadUrl.searchParams.get(
                    'AWSAccessKeyId'
                  ),
                  'Content-Type': parsedUploadUrl.searchParams.get(
                    'Content-Type'
                  ),
                  'Cache-Control': parsedUploadUrl.searchParams.get(
                    'Cache-Control'
                  ),
                  Expires: parsedUploadUrl.searchParams.get('Expires'),
                  Signature: parsedUploadUrl.searchParams.get('Signature'),
                },
                data: blobData,
              })

              if (putResult.status === 200) {
                setUploadedFile(get(uploadUrl.split('?'), '[0]', uploadUrl))
                setError(null)
              } else {
                setUploadedFile(null)
                setError('An error occurred. Check dev console for more information.')
                console.error('ERROR', putResult)
              }
            } catch (e) {
              setUploadedFile(null)
              console.error('ERROR', e)
            }
            setLoading(false)
          } else {
            setLoading(false)
            setUploadedFile(null)
            setError('ONLY PDFS ALLOWED TO BE UPLOADED.')
          }
        }
      } else {
        console.error('ERROR', error)
        setLoading(false)
      }
    }

    if (filename) {
      reader.readAsDataURL(filename)
    }
  }

  /**
   * Render
   */
  return (
    <>
      <div className="upload-to-s3">
        <h1 className="title">AWS UPLOAD EXAMPLE</h1>
        {loading && (<Loading />)}

        {!loading && (
          <form className="upload-form" action="#" onSubmit={handleFormSubmit}>
            <FileInput forwardRef={uploadInputRef} name="pdfUpload" className="pdf-input" onChange={() => setSelectedFile(get(uploadInputRef, 'current.files[0]', null))}/>
            <button type="submit" className="btn btn-primary" disabled={selectedFile === null}>Submit</button>
          </form>
        )}

        {(error || uploadedFile) && (
          <div className="notices">
            {error && (
              <div className="error">
                <p>{error}</p>
              </div>
            )}

            {uploadedFile && (
              <div className="success">
                <p>
                  File successfully uploaded to: <br />
                  <a href={uploadedFile} target="_blank">{uploadedFile}</a>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default UploadToS3
