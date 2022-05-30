import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAppendInfoComponent } from './modal-append-info.component';

describe('ModalAppendInfoComponent', () => {
  let component: ModalAppendInfoComponent;
  let fixture: ComponentFixture<ModalAppendInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAppendInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAppendInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
