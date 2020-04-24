export interface IUpload {
  mtime: Date | string
  fileName: string
  localName: string
  fileUrl: string
  fileType: string
  fileSize: string | number
  fileExt: string
}
