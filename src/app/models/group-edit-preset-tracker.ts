
//Used to track whether or not the data was already preset from the group being edited
export class GroupEditPresetTracker {

  public page1: boolean;
  public page2: boolean;
  public page3: boolean;
  public page4: boolean;
  public page5: boolean;
  public page6: boolean;

  constructor() {
    this.page1 = false;
    this.page2 = false;
    this.page3 = false;
    this.page4 = false;
    this.page5 = false;
    this.page6 = false;
  }
}