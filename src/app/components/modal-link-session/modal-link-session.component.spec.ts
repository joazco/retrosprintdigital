import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLinkSessionComponent } from './modal-link-session.component';

describe('ModalLinkSessionComponent', () => {
  let component: ModalLinkSessionComponent;
  let fixture: ComponentFixture<ModalLinkSessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalLinkSessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalLinkSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
