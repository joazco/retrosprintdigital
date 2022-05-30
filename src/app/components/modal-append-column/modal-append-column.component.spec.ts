import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAppendColumnComponent } from './modal-append-column.component';

describe('ModalAppendColumnComponent', () => {
  let component: ModalAppendColumnComponent;
  let fixture: ComponentFixture<ModalAppendColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAppendColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAppendColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
