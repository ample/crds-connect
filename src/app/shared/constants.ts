export const ApplicationUrl: string = `//${process.env.CRDS_ENV || 'www'}.crossroads.net/group-leader/home`;

export const AgeGroupAttributeTypeId: number = 91;

export const crdsOakleyCoords: any = {
  lat: 39.159398,
  lng: -84.423367
};

export const earthsRadiusInMiles: number = 3443.9;

export const groupDescriptionLength: number = 44;

export const groupDescriptionLengthDetails: number = 265;

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

  constructor () {
    this.GROUP_KIDS_WELCOME = 'groupkidswelcome';
    this.GROUP_AGE_RANGE = 'groupagerange';
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

export const initialMapZoom = 5;

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
