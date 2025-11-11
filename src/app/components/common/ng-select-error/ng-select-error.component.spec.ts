import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgSelectErrorComponent } from './ng-select-error.component';

describe('NgSelectErrorComponent', () => {
  let component: NgSelectErrorComponent;
  let fixture: ComponentFixture<NgSelectErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgSelectErrorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgSelectErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
