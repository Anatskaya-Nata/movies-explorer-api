class ConflictAccess409 extends Error {
  constructor(message) {
    super(message);
    this.status = 409;
    this.message = message;
  }
}

module.exports = ConflictAccess409;
