export class Inquiry {
    groupId: number;
    emailAddress: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    requestDate: Date;
    placed: boolean;
    inqueryId: number;
    contactId: number;
    message: string;

    constructor($groupId: number, $email: string, $phoneNumber: string, $firstName: string, $lastName: string, $requestDate: Date,
                $placed: boolean, $inquiryId: number, $contactId: number, $message: string) {
            this.groupId = $groupId;
            this.emailAddress = $email;
            this.phoneNumber = $phoneNumber;
            this.firstName = $firstName;
            this.lastName = $lastName;
            this.requestDate = $requestDate;
            this.placed = $placed;
            this.inqueryId  = $inquiryId;
            this.contactId  = $contactId;
            this.message = $message;
    }
}
