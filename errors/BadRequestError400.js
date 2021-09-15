class BadRequestError400 extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
    this.message = message;
  }
}

module.exports = BadRequestError400;
