import { GeoCoordinates } from '../models';
import { environment } from '../../environments/environment';
export const ApplicationUrl: string = `//${environment.CRDS_ENV || 'www'}.crossroads.net/groups/leader`;

export class AwsMeetingTimeSearchStrings {
  MORNINGS: string;
  AFTERNOONS: string;
  EVENINGS: string;

  constructor() {
    this.MORNINGS = "['0001-01-01T00:00:00Z', '0001-01-01T12:00:00Z']";
    this.AFTERNOONS = "['0001-01-01T12:00:00Z', '0001-01-01T17:00:00Z']";
    this.EVENINGS = "['0001-01-01T17:00:00Z', '0001-01-01T23:59:00Z']";
  }
}

export enum GroupPageNumber {
  ONE = 1,
  TWO,
  THREE,
  FOUR,
  FIVE,
  SIX
}

export class GroupPaths {
    ADD: string;
    EDIT: string;

    constructor() {
        this.ADD = 'create-group';
        this.EDIT = 'edit-group';
    }
}

export const groupPaths = new GroupPaths();

export class GroupPageHeaders {
  ADD: string;
  EDIT: string;

  constructor() {
    this.ADD = 'start a group';
    this.EDIT = 'edit my group';
  }
}

export class TextConstants {
  MY_GROUPS: string;
  MY_CONNECTIONS: string;
  ONLINE_GROUP: string;
  INVALID_OR_MISSING_ADDRESS: string;
  GROUP_PAGE_HEADERS: GroupPageHeaders;


  constructor() {
    this.MY_GROUPS = 'My groups';
    this.MY_CONNECTIONS = 'My connections';
    this.ONLINE_GROUP = 'Online Group';
    this.INVALID_OR_MISSING_ADDRESS = 'Invalid or Missing Address';
    this.GROUP_PAGE_HEADERS = new GroupPageHeaders();
  }
}

export const ClusterStyles = [{
  url: '//crds-cms-uploads.s3.amazonaws.com/connect/CLUSTER.svg',
  height: 50,
  width: 50,
  textColor: '#fff'
}];

export const MaxZoomForClustering: number = 15;

export const textConstants = new TextConstants();

export const locationBackText: string = 'BACK';

export const awsMeetingTimeSearchStrings = new AwsMeetingTimeSearchStrings();

export class GroupMeetingTimeRanges {

  MORNINGS: string;
  AFTERNOONS: string;
  EVENINGS: string;

  constructor() {
    this.MORNINGS = 'Mornings (before noon)';
    this.AFTERNOONS = 'Afternoons (12-5pm)';
    this.EVENINGS = 'Evenings (after 5pm)';
  }
}

export const groupMeetingTimeRanges = new GroupMeetingTimeRanges();

export class PinsShown {
  MY_STUFF: string;
  EVERYONES_STUFF: string;

  constructor() {
    this.MY_STUFF = 'my';
    this.EVERYONES_STUFF = 'world';
  }
}

export const pinsShown: PinsShown = new PinsShown();

export class GroupMeetingScheduleType {
  SPECIFIC_TIME_AND_DATE: string;
  FLEXIBLE: string;

  constructor() {
    this.SPECIFIC_TIME_AND_DATE = 'specific';
    this.FLEXIBLE = 'flexible';
  }
}

export class DaysOfWeek {
  public MONDAY: string;
  public TUESDAY: string;
  public WEDNESDAY: string;
  public THURSDAY: string;
  public FRIDAY: string;
  public SATURDAY: string;
  public SUNDAY: string;

  constructor() {
    this.MONDAY = 'Monday';
    this.TUESDAY = 'Tuesday';
    this.WEDNESDAY = 'Wednesday';
    this.THURSDAY = 'Thursday';
    this.FRIDAY = 'Friday';
    this.SATURDAY = 'Saturday';
    this.SUNDAY = 'Sunday';
  }
}

export const daysOfWeekList: string[] = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

export const daysOfWeek = new DaysOfWeek();

export const groupMeetingScheduleType: GroupMeetingScheduleType = new GroupMeetingScheduleType();

export class AttributeTypes {
  AgeRangeAttributeTypeId: number;
  GroupGenderMixTypeAttributeId: number;
  GroupCategoryAttributeTypeId: number;
  MiddleSchoolAgeRangeAttributeId: number;
  HighSchoolAgeRangeAttributeId: number;

  constructor() {
    this.AgeRangeAttributeTypeId = 91;
    this.GroupGenderMixTypeAttributeId = 73;
    this.GroupCategoryAttributeTypeId = 90;
    this.MiddleSchoolAgeRangeAttributeId = 7089;
    this.HighSchoolAgeRangeAttributeId = 7090;
  }
}

export const attributeTypes: any = new AttributeTypes();

export const SpiritualGrowthCongregationId: number = 8;
export const SmallGroupTypeId: number = 1;

export const crdsOakleyCoords: any = {
  lat: 39.159398,
  lng: -84.423367
};

export const centerOfTheUsCoords: GeoCoordinates = {
  lat: 39.8283,
  lng: -98.5795
};

export const earthsRadiusInMiles: number = 3443.9;

export const desiredPrecisionForProximityNumber: number = 2;

export const maxValidProximity: number = 5000;

export const groupDescriptionLength: number = 44;

export const groupDescriptionLengthDetails: number = 265;

export const MaxGroupLeaders: number = 4;
export const MaxGroupApprentices: number = 2;

export const OnsiteGroupsUrl: string = `//${environment.CRDS_ENV || 'www'}.crossroads.net/onsitegroups`;

export const GroupResourcesUrl: string = `//${environment.CRDS_ENV || 'www'}.crossroads.net/groups/resources/`;
export const LeaderResourcesUrl: string = `//${environment.CRDS_ENV || 'www'}.crossroads.net/groups/leader/resources`;

export class AppType {
  Connect: string;
  Groups: string;

  constructor () {
    this.Connect = 'CONNECT';
    this.Groups = 'SMALL_GROUPS';
  }
}

// View Types:
export enum ViewType {
  MAP = 1,
  LIST = 2
}

export const appType: AppType = new AppType();

export class AwsFieldNames {
  GROUP_KIDS_WELCOME: string;
  GROUP_AGE_RANGE: string;
  GROUP_CATEGORY: string;
  GROUP_TYPE: string;
  GROUP_VIRTUAL: string;
  MEETING_DAY: string;
  MEETING_FREQUENCY: string;
  MEETING_TIME: string;
  PIN_TYPE: string;

  constructor () {
    this.GROUP_KIDS_WELCOME = 'groupkidswelcome';
    this.GROUP_AGE_RANGE = 'groupagerange';
    this.GROUP_CATEGORY = 'groupcategory';
    this.GROUP_TYPE = 'grouptype';
    this.GROUP_VIRTUAL = 'groupvirtual';
    this.MEETING_DAY = 'groupmeetingday';
    this.MEETING_FREQUENCY = 'groupmeetingfrequency';
    this.MEETING_TIME = 'groupmeetingtime';
    this.PIN_TYPE = 'pintype';
  }
}
export const awsFieldNames: AwsFieldNames = new AwsFieldNames();

export enum LeadershipApplicationType {
  ANYWHERE_HOST,
  GROUP_LEADER
}

export enum GroupLeaderApplicationStatus {
  NOT_APPLIED = 1,
  INTERESTED,
  APPLIED,
  APPROVED,
  DENIED
}

export class LeaderStatus {
  status: number;
}

export enum GroupRole {
  TRIAL_MEMBER = 67,
  MEMBER = 16,
  LEADER = 22,
  APPRENTICE = 66,
  NONE = 0
}

// Zoom Constants:
export const initialMapZoom: number = 9;    // Starting zoom used when calculating best zoom for a given search
export const zoomAdjustment: number = 1;    // Subtracted from the calculated zoom to avoid having pins on the edge of the map
export const minZoom: number = 3;           // The minimum zoom before zoomAdjustment is applied
export const maxZoom: number = 15;          // The maximum zoom before zoomAdjustment is applied
export const pinTargetGroups: number = 1;   // The target number of pins for group app; used when calculating the best zoom
export const pinTargetConnect: number = 10; // The target number of pins for connect app; used when calculating the best zoom

export class MeetingFrequencyNames {
  WEEKLY: string;
  BI_WEEKLY: string;
  MONTHLY: string;

  constructor () {
    this.WEEKLY = 'Every Week';
    this.BI_WEEKLY = 'Every Other Week';
    this.MONTHLY = 'Every Month';
  }
}

export const meetingFrequencyNames = new MeetingFrequencyNames();

export const meetingFrequencies = [{
  meetingFrequencyId: 1,
  meetingFrequencyDesc: meetingFrequencyNames.WEEKLY
}, {
  meetingFrequencyId: 2,
  meetingFrequencyDesc: meetingFrequencyNames.BI_WEEKLY
}, {
  meetingFrequencyId: 8,
  meetingFrequencyDesc: meetingFrequencyNames.MONTHLY
}];

export const usStatesList: string[] = [
  'AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA',
  'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR',
  'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY'
];

export const sayHiTemplateId: number = 2013;

export enum UserState {
  LoggedIn_NotOnMap,
  LoggedIn_OnMap,
  NotLoggedIn
}

export enum HttpStatusCodes {
  CONFLICT = 409
}

// The default value for proximity to user's current location when no location data is available
export let proximityUnavailableDefaultNum: number = 999;

export const googleMapStyles: Array<any> = [
  {
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#f5f5f5'
      }
    ]
  },
  {
    'elementType': 'labels.icon',
    'stylers': [
      {
        'visibility': 'off'
      }
    ]
  },
  {
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#616161'
      }
    ]
  },
  {
    'elementType': 'labels.text.stroke',
    'stylers': [
      {
        'color': '#f5f5f5'
      }
    ]
  },
  {
    'featureType': 'administrative.land_parcel',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#bdbdbd'
      }
    ]
  },
  {
    'featureType': 'administrative.province',
    'elementType': 'geometry.stroke',
    'stylers': [
      {
        'color': '#979797'
      },
      {
        'weight': 1
      }
    ]
  },
  {
    'featureType': 'poi',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#eeeeee'
      }
    ]
  },
  {
    'featureType': 'poi',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#757575'
      }
    ]
  },
  {
    'featureType': 'poi.park',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#e5e5e5'
      }
    ]
  },
  {
    'featureType': 'poi.park',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#9e9e9e'
      }
    ]
  },
  {
    'featureType': 'road',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#ffffff'
      }
    ]
  },
  {
    'featureType': 'road.arterial',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#757575'
      }
    ]
  },
  {
    'featureType': 'road.highway',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#dadada'
      }
    ]
  },
  {
    'featureType': 'road.highway',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#616161'
      }
    ]
  },
  {
    'featureType': 'road.local',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#9e9e9e'
      }
    ]
  },
  {
    'featureType': 'transit.line',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#e5e5e5'
      }
    ]
  },
  {
    'featureType': 'transit.station',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#eeeeee'
      }
    ]
  },
  {
    'featureType': 'water',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#c9c9c9'
      }
    ]
  },
  {
    'featureType': 'water',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#9e9e9e'
      }
    ]
  }
];
