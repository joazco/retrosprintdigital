import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMinusColumnComponent } from './modal-minus-column.component';

describe('ModalMinusColumnComponent', () => {
  let component: ModalMinusColumnComponent;
  let fixture: ComponentFixture<ModalMinusColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalMinusColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMinusColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
