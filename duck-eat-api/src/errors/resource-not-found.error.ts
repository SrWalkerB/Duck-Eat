export class ResourceNotFoundError extends Error {
	constructor(name = "Not found", message = "Resource not found") {
		super();
		this.name = name;
		this.message = message;
	}
}
