import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateSessionComponent } from './modal-create-session.component';

describe('ModalCreateSessionComponent', () => {
  let component: ModalCreateSessionComponent;
  let fixture: ComponentFixture<ModalCreateSessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCreateSessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCreateSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
