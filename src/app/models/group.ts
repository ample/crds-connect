import { Address } from './address';
import { Participant } from './participant';

export class Group {

    groupId: number;
    groupName: string;
    groupDescription: string;
    groupTypeName: string;
    ministryId: number;
    congregationId: number;
    congregationName: string;
    attributeTypes: any = {};
    primaryContactId: number;
    primaryContactEmail: number;
    startDate: string;
    endDate: string;
    reasonEndedId: number;
    availableOnline: boolean;
    remainingCapacity: number;
    groupFullInd: boolean;
    waitListInd: boolean;
    waitListGroupId: number;
    childCareInd: boolean;
    meetingDayId: number;
    meetingDay: string;
    meetingTime: string;
    meetingFrequency: string;
    meetingFrequencyId: number;
    address: Address;
    targetSize: number;
    kidsWelcome: boolean;
    proximity: number;
    Participants: Participant[];
    groupTypeId?: number;
    participantCount: number;

    categories: string[];
    ageRanges: string[];
    primaryContactFirstName: string;
    primaryContactLastName: string;
    isVirtualGroup: boolean;
    primaryContactCongregation: string;
    groupType: string;

    // Date is in there for create group form
    public static overload_Constructor_One(groupId: number, participants: Participant[]): Group {
        return new Group(groupId, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, '1983-07-16T21:00:00.000Z', null, null, null, null, null, null, participants);
    }

    constructor($groupId?: number, $groupName?: string, $groupDescription?: string, $groupTypeName?: string, $ministryId?: number,
    $congregationId?: number, $congregationName?: string, $primaryContactId?: number,
    $primaryContactEmail?: number, $startDate?: string, $endDate?: string, $reasonEndedId?: number, $availableOnline?: boolean,
    $remainingCapacity?: number, $groupFullInd?: boolean, $waitListInd?: boolean, $waitListGroupId?: number,
    $childCareInd?: boolean, $meetingDayId?: number, $meetingDay?: string, $meetingTime?: string, $meetingFrequency?: string,
    $meetingFrequencyId?: number, $address?: Address, $targetSize?: number, $kidsWelcome?: boolean, $proximity?: number,
    $Participants?: Participant[], $groupTypeId?: number, $participantCount?: number) {
        this.groupId = $groupId;
        this.groupName = $groupName;
        this.groupDescription = $groupDescription;
        this.groupTypeName = $groupTypeName;
        this.ministryId = $ministryId;
        this.congregationId = $congregationId;
        this.congregationName = $congregationName;
        this.primaryContactId = $primaryContactId;
        this.primaryContactEmail = $primaryContactEmail;
        this.startDate = $startDate;
        this.endDate = $endDate;
        this.reasonEndedId = $reasonEndedId;
        this.availableOnline = $availableOnline;
        this.remainingCapacity = $remainingCapacity;
        this.groupFullInd = $groupFullInd;
        this.waitListInd = $waitListInd;
        this.waitListGroupId = $waitListGroupId;
        this.childCareInd = $childCareInd;
        this.meetingDayId = $meetingDayId;
        this.meetingDay = $meetingDay;
        this.meetingTime = $meetingTime;
        this.meetingFrequency = $meetingFrequency;
        this.meetingFrequencyId = $meetingFrequencyId;
        this.address = $address;
        this.targetSize = $targetSize;
        this.kidsWelcome = $kidsWelcome;
        this.proximity = $proximity;
        this.Participants = $Participants;
        this.groupTypeId = $groupTypeId;
        this.participantCount = $participantCount;
    }

}
