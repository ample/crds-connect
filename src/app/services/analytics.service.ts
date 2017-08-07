import { Injectable } from '@angular/core';
import { Angulartics2 } from 'angulartics2';

@Injectable()
export class AnalyticsService {

  constructor(private analytics: Angulartics2) {
  }

  sayHiButtonPressed(action: string, category: string) {
    this.analytics.eventTrack.next( {
        action: action,
        properties: {
            category: category
        }
    });
  }

  updateResultsPressed(category: string) {
    this.analytics.eventTrack.next({
      action: 'Update Results Button Click',
      properties: {
        category: category
      }
    });
  }

  joinGathering() {
    this.analytics.eventTrack.next({
      action: 'Join Gathering Button Click',
      properties: {
        category: 'Connect'
      }
    });
  }

  joinGroup() {
    this.analytics.eventTrack.next({
      action: 'Join Group Button Click',
      properties: {
        category: 'Groups'
      }
    });
  }

  myConnections() {
    this.analytics.eventTrack.next({
      action: 'My Connections Button Click',
      properties: {
        category: 'Connect'
      }
    });
  }

  myGroups() {
    this.analytics.eventTrack.next({
      action: 'My Groups Button Click',
      properties: {
        category: 'Groups'
      }
    });
  }

}
