export class NotAuthorization extends Error {
	constructor(name = "Not Authorization", message = "Not Authorization") {
		super();
		this.name = name;
		this.message = message;
	}
}
