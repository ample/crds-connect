export const ApplicationUrl: string = `//${process.env.CRDS_ENV || 'www'}.crossroads.net/group-leader/home`;

export class AttributeTypes {
  AgeRangeAttributeTypeId: number;
  GroupGenderMixTypeAttributeId: number;
  GroupCategoryAttributeTypeId: number;

  constructor() {
    this.AgeRangeAttributeTypeId = 91;
    this.GroupGenderMixTypeAttributeId = 73;
    this.GroupCategoryAttributeTypeId = 90;
  }
}

export const attributeTypes: any = new AttributeTypes();
export const MiddleSchoolAgeRangeAttributeId: number = 7089;
export const HighSchoolAgeRangeAttributeId: number = 7090;
export const SpiritualGrowthCongregationId: number = 8;
export const SmallGroupTypeId: number = 1;

export const crdsOakleyCoords: any = {
  lat: 39.159398,
  lng: -84.423367
};



export const earthsRadiusInMiles: number = 3443.9;

export const groupDescriptionLength: number = 44;

export const groupDescriptionLengthDetails: number = 265;

export const MaxGroupLeaders: number = 4;
export const MaxGroupApprentices: number = 2;

export const OnsiteGroupsUrl: string = `//${process.env.CRDS_ENV || 'www'}.crossroads.net/onsitegroups`;

// TODO can we delete this? AppRoute
export class AppRoute {
  CONNECT_ROUTE: string;
  SMALL_GROUPS_ROUTE: string;

  constructor() {
    this.CONNECT_ROUTE = '/';
    this.SMALL_GROUPS_ROUTE = '/groupsv2';
  }
}

export class App {
  CONNECT: string;
  SMALL_GROUPS: string;

  constructor() {
    this.CONNECT = 'CONNECT';
    this.SMALL_GROUPS = 'SMALL_GROUPS';
  }
}

export enum AppType {
  Connect,
  Groups
}

export class AwsFieldNames {
  GROUP_KIDS_WELCOME: string;
  GROUP_AGE_RANGE: string;
  GROUP_TYPE: string;
  GROUP_VIRTUAL: string;

  constructor () {
    this.GROUP_KIDS_WELCOME = 'groupkidswelcome';
    this.GROUP_AGE_RANGE = 'groupagerange';
    this.GROUP_TYPE = 'grouptype';
    this.GROUP_VIRTUAL = 'groupvirtual';
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

export class PlaceholderTextForSearchBar {
  ADDRESS: string;
  KEYWORD: string;

  constructor () {
    this.ADDRESS = 'Address...';
    this.KEYWORD = 'Keyword...';
  }
}

export enum GroupRole {
  MEMBER = 16,
  LEADER = 22,
  APPRENTICE = 66,
  NONE = 0
}


export const appRoute: AppRoute = new AppRoute();
export const app: App = new App();
export const placeholderTextForSearchBar: PlaceholderTextForSearchBar = new PlaceholderTextForSearchBar();

// Zoom Constants:
export const initialMapZoom: number = 5;    // Starting zoom used when calculating best zoom for a given search
export const zoomAdjustment: number = 1;    // Subtracted from the calculated zoom to avoid having pins on the edge of the map
export const minZoom: number = 3;           // The minimum zoom before zoomAdjustment is applied
export const maxZoom: number = 15;          // The maximum zoom before zoomAdjustment is applied
export const pinTargetGroups: number = 1;   // The target number of pins for group app; used when calculating the best zoom
export const pinTargetConnect: number = 10; // The target number of pins for connect app; used when calculating the best zoom

export const meetingFrequencies = [{
            meetingFrequencyId: 1,
            meetingFrequencyDesc: 'Every week'
        }, {
            meetingFrequencyId: 2,
            meetingFrequencyDesc: 'Every other week'
        }, {
            meetingFrequencyId: 8,
            meetingFrequencyDesc: 'Every month'
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

// The starting point for calculating the best zoom for a given search
export const initialZoom: number = 9;

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
