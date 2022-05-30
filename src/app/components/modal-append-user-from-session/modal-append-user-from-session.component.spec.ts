import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAppendUserFromSessionComponent } from './modal-append-user-from-session.component';

describe('ModalAppendUserFromSessionComponent', () => {
  let component: ModalAppendUserFromSessionComponent;
  let fixture: ComponentFixture<ModalAppendUserFromSessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAppendUserFromSessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAppendUserFromSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
