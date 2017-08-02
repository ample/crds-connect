import { Address } from './address';
import { Participant } from './participant';

import { TimeHelperService} from '../services/time-helper.service';

import { defaultGroupMeetingTime, SmallGroupTypeId, SpiritualGrowthCongregationId } from '../shared/constants';
import * as moment from 'moment';

let hlpr: TimeHelperService = new TimeHelperService();

export class Group {

    groupId: number;
    groupName: string;
    groupDescription: string;
    groupTypeName: string;
    ministryId: number;
    congregationId: number;
    congregationName: string;
    attributeTypes: any = {};
    singleAttributes: any = {};
    // TODO: Remove one of these
    contactId: number;
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
    minorAgeGroupsAdded: boolean;

    categories: string[] = [];
    ageRanges: string[] = [];
    primaryContactFirstName: string;
    primaryContactLastName: string;
    isVirtualGroup: boolean;
    primaryContactCongregation: string;
    groupType: string;

    public static overload_Constructor_One(groupId: number, participants: Participant[]): Group {
        return new Group(groupId, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null,
        null, null, null, participants, null, null, null);
    }

    public static overload_Constructor_CreateGroup(contactId: number) {
        let today = moment.utc(new Date());
        let group = new Group(0, null, null, null, SpiritualGrowthCongregationId, null, null, contactId, null, today.utc().format(), null,
        null, null, null, null, null, null, null, null, null, defaultGroupMeetingTime,
        null, null, Address.overload_Constructor_One(), null, null, null, null, SmallGroupTypeId, null, null);
        group.isVirtualGroup = false;
        return group;
    }

    constructor($groupId?: number, $groupName?: string, $groupDescription?: string, $groupTypeName?: string, $ministryId?: number,
    $congregationId?: number, $congregationName?: string, $primaryContactId?: number,
    $primaryContactEmail?: number, $startDate?: string, $endDate?: string, $reasonEndedId?: number, $availableOnline?: boolean,
    $remainingCapacity?: number, $groupFullInd?: boolean, $waitListInd?: boolean, $waitListGroupId?: number,
    $childCareInd?: boolean, $meetingDayId?: number, $meetingDay?: string, $meetingTime?: string, $meetingFrequency?: string,
    $meetingFrequencyId?: number, $address?: Address, $targetSize?: number, $kidsWelcome?: boolean, $proximity?: number,
    $Participants?: Participant[], $groupTypeId?: number, $participantCount?: number, $minorAgeGroupsAdded?: boolean) {
        this.groupId = $groupId;
        this.groupName = $groupName;
        this.groupDescription = $groupDescription;
        this.groupTypeName = $groupTypeName;
        this.ministryId = $ministryId;
        this.congregationId = $congregationId;
        this.congregationName = $congregationName;
        this.primaryContactId = $primaryContactId;
        this.contactId = $primaryContactId;
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
        this.meetingTime = hlpr.adjustUtcStringToAccountForLocalOffSet($meetingTime || defaultGroupMeetingTime,
            false);
        this.meetingFrequency = $meetingFrequency;
        this.meetingFrequencyId = $meetingFrequencyId;
        this.address = $address;
        this.targetSize = $targetSize;
        this.kidsWelcome = $kidsWelcome;
        this.proximity = $proximity;
        this.Participants = $Participants;
        this.groupTypeId = $groupTypeId;
        this.participantCount = $participantCount;
        this.minorAgeGroupsAdded = $minorAgeGroupsAdded;
    }

}
