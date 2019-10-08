/**
 * upload image to server
 *
 * @param {Express} app
 * @param {Formidable} formidable
 * @param {Path} filePath
 * @param {Result} result
 */
module.exports = (app, formidable, filePath, result) => {
  const avatarPath = filePath.resolve('./image/avatar/'); // filepath
  app.post('/uploaduserAvatar', async (req, res) => {
    const form = new formidable.IncomingForm();
    let newName = '';
    form.parse(req);
    form.on('fileBegin', (name, file) => {
      // create new name, add Date.now to make it unique
      newName = Date.now() + '_' + file.name.split(' ').join('_');
      // set file path
      file.path = avatarPath + '/' + newName;
    });
    form.on('file', (name, file) => {});
    // catch any error
    form.on('error', (err) => {
      console.log(err);
      return;
    });
    // finish, send the result back to front
    form.on('end', () => {
      result.setResult(true, newName);
      res.send(result);
      result.resetResult();
    });
  });
}
