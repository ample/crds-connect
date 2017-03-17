export class Person {

    firstname: string;
    lastname: string;
    email: string;

    constructor(first_name?: string, last_name?: string, email?: string) {
        this.firstname = first_name;
        this.lastname = last_name;
        this.email = email;
    }
}
