export class ResourceConflictError extends Error{
    constructor(name: string = "Conflict", message: string = ""){
        super();
        this.name = name;
        this.message = message;
    }
}