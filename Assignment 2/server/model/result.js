//Result used to send to the client side
class Result {
  /**
   * Creates an instance of Result.
   * @param {boolean} status
   * @param {string} msg
   * @memberof Result
   */
  constructor(status, msg){
      this.status = status;
      this.msg = msg;
  }

  /**
   * Set new result value
   *
   * @param {boolean} status
   * @param {string} msg
   * @memberof Result
   */
  setResult(status, msg) {
    this.status = status;
    this.msg = msg;
  }

  /**
   * Reset the result to default state: false, message -> empty
   *
   * @memberof Result
   */
  resetResult() {
    this.status = false;
    this.msg = '';
  }
}

module.exports = Result;