export class Participant {

    congregation: string
    contactId: number
    displayName: string
    email: string
    groupParticipantId: number
    groupRoleId: number
    groupRoleTitle: string
    isApprovedLeader: boolean
    lastName: string
    nickName: string
    participantId: number
    startDate: string

    constructor($congregation: string, $contactId: number, $displayName: string, 
                $email: string, $groupParticipantId: number, $groupRoleId: number, 
                $groupRoleTitle: string, $isApprovedLeader: boolean, $lastName: string, 
                $nickName: string, $participantId: number, $startDate: string) {
        this.congregation=$congregation;
        this.contactId=$contactId;
        this.displayName=$displayName;
        this.email=$email;
        this.groupParticipantId=$groupParticipantId;
        this.groupRoleId=$groupRoleId;
        this.groupRoleTitle=$groupRoleTitle;
        this.isApprovedLeader=$isApprovedLeader;
        this.lastName=$lastName;
        this.nickName=$nickName;
        this.participantId=$participantId;
        this.startDate=$startDate;
    }


}
