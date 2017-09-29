import { Component, Input} from '@angular/core';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'crds-content-block',
  template: '<span [innerHtml]="content.getContent(id)"></span>'
})
export class ContentBlockComponent {
  private output: String;
  @Input() id: string;

  constructor(public content: ContentService) {}

  public ngOnInit() {
    this.content.loadData();
  }
}
