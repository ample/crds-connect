import { Address } from './address';
import { Participant } from './participant'

export class Group {

    groupId: number;
    groupName: string;
    groupDescription: string;
    groupTypeName: string;
    ministryId: number;
    congregationId: number;
    congregationName: string;
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


   constructor($groupId: number, $groupName: string, $groupDescription: string, $groupTypeName: string, $ministryId: number, $congregationId: number, $congregationName: string, $primaryContactId: number, $primaryContactEmail: number, $startDate: string, $endDate: string, $reasonEndedId: number, $availableOnline: boolean, $remainingCapacity: number, $groupFullInd: boolean, $waitListInd: boolean, $waitListGroupId: number, $childCareInd: boolean, $meetingDayId: number, $meetingDay: string, $meetingTime: string, $meetingFrequency: string, $meetingFrequencyId: number, $address: Address, $targetSize: number, $kidsWelcome: boolean, $proximity: number, $Participants: Participant[], $groupTypeId: number = null) {
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
	}


}
