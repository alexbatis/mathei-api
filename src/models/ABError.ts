interface IABError {
    message?: string;
    status?: number;
    error: any;
}
export class ABError {
    public message: String;
    public status: number;
    public error: any;
    constructor(err?: IABError) {
        this.message = err && err.message || null;
        this.status = err && err.status || 500;
        this.error = err && err.error || null;
    }
}