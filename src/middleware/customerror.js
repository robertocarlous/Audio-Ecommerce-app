
class BadRequestError extends Error {
    constructor(message) {
      super(message);
      this.name = this.constructor.name;
      this.statusCode = 400;
      this.expose = true;
    }
  }
  
  class NotFoundError extends Error {
    constructor(message) {
      super(message);
      this.name = this.constructor.name;
      this.statusCode = 404;
      this.expose = true;
    }
  }
  
  class ConflictError extends Error {
    constructor(message) {
      super(message);
      this.name = this.constructor.name;
      this.statusCode = 409;
      this.expose = true;
    }
  }
  
  class InternalServerError extends Error {
    constructor(message) {
      super(message);
      this.name = this.constructor.name;
      this.statusCode = 500;
      this.expose = true;
    }
  }
  
  module.exports = {
    BadRequestError,
    NotFoundError,
    ConflictError,
    InternalServerError,
  };
  