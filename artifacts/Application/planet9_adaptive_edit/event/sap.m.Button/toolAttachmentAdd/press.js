const app = oApp.getDomRef();
const uploader = app.querySelector('#_editUploader');

report.uploadFieldAfterRender(uploader);
uploader.click();