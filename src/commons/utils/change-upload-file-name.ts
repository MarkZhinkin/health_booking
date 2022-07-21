export default function changeUploadFileName(request, file, callback) {
    callback(null, `${request.userId}.${file.originalname.split(".").slice(-1).pop()}`);
  }