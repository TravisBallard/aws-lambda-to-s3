const AWS = require('aws-sdk')
const S3 = new AWS.S3()

const { uuid } = require('uuidv4')

module.exports.PDFFileUpload = async (event, context, callback) => {
  try {
    const _uuid = uuid()
    const filename = `${_uuid}.pdf`

    const params = {
      Bucket: 'tbd-upload-bucket',
      Key: filename,
      ContentType: 'application/pdf',
      CacheControl: 'max-age=31104000',
      ACL: 'public-read',
    }

    return new Promise((resolve, reject) => {
      const uploadUrl = S3.getSignedUrl( 'putObject', params)
      resolve({
        statusCode: 200,
        isBase64Encoded: false,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          uploadUrl: uploadUrl,
          pdfFilename: filename,
        })
      })
    })

  } catch (e) {
    console.log('ERROR', e)
    callback(null, {
      statusCode: 404,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        message: 'Error',
        error: e,
      }),
    })
  }
}
