/* tslint:disable:no-unused-variable */

import { HttpModule } from '@angular/http';
import { TestBed } from '@angular/core/testing';
import { ListFooterComponent } from './list-footer.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('Component: Map Footer', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ListFooterComponent
      ],
      imports: [
        HttpModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
      ]
    });
    this.fixture = TestBed.createComponent(ListFooterComponent);
    this.component = this.fixture.componentInstance;

  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

});



