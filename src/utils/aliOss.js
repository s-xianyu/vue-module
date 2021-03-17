import OSS from 'ali-oss'

const client = new OSS({
  region: '',
  accessKeyId: '',
  accessKeySecret: '',

  bucket: 'wuneng-public'
})
export default client
