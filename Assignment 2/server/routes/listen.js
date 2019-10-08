const Result = require('../model/result.js');
/**
 * Connect to server port 3000
 *
 * @param {*} http
 * @param {*} callback
 */
module.exports = (http, callback) => {
  let server = http.listen(3000, () => {
    let host = server.address().address;
    let port = server.address().port;
    const result = new Result(true, 'connected to server on port 3000');
    callback(result);
  });
}
