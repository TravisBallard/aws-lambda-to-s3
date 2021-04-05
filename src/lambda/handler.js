const AWS = require('aws-sdk')
const S3 = new AWS.S3()

const { uuid } = require('uuidv4')

const mimeTypeMap = {
  'application/pdf': 'pdf',
  'image/jpeg': 'jpg',
  'image/pjpeg': 'jpg',
  'image/x-citrix-jpeg': 'jpg',
  'image/gif': 'gif',
  'image/png': 'png',
  'image/x-png': 'png',
}

const getExtensionFromMimeType = mimeType => {
  const acceptedTypes = Object.keys(mimeTypeMap)
  if (!acceptedTypes.includes(mimeType)) {
    return false
  }

  return mimeTypeMap[mimeType]
}

module.exports.fileUpload = async (event, context, callback) => {
  try {
    const _uuid = uuid()
    const { mimeType } = event.queryStringParameters
    const extension = getExtensionFromMimeType(mimeType)
    const filename = `${_uuid}.${extension}`

    const params = {
      Bucket: 'els-lambda-2021',
      Key: filename,
      ContentType: mimeType,
      CacheControl: 'max-age=31104000',
      ACL: 'public-read',
    }

    return new Promise((resolve, reject) => {
      if (!extension) {
        reject('Invalid extension type')
      } else {
        const uploadUrl = S3.getSignedUrl('putObject', params)
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
      }
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
