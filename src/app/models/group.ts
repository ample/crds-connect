import { Address } from './address';
import { Participant } from './participant';
import { SmallGroupTypeId, SpiritualGrowthCongregationId } from '../shared/constants';

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
  startDate: number;
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

  categories: string[];
  ageRanges: string[];
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
    return new Group(0, null, null, null, SpiritualGrowthCongregationId, null, null, contactId, null, new Date().getDate(), null,
    null, null, null, null, null, null, null, null, null, '1983-07-16T21:00:00.000Z',
    null, null, Address.overload_Constructor_One(), null, null, null, null, SmallGroupTypeId, null, null);
  }

  constructor($groupId?: number, $groupName?: string, $groupDescription?: string, $groupTypeName?: string, $ministryId?: number,
  $congregationId?: number, $congregationName?: string, $primaryContactId?: number,
  $primaryContactEmail?: number, $startDate?: number, $endDate?: string, $reasonEndedId?: number, $availableOnline?: boolean,
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
    this.minorAgeGroupsAdded = $minorAgeGroupsAdded;
  }
}
