export class AccountAlreadyExistError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AccountAlreadyExistError";
  }
}