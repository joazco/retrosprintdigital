import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonsSessionComponent } from './buttons-session.component';

describe('ButtonsSessionComponent', () => {
  let component: ButtonsSessionComponent;
  let fixture: ComponentFixture<ButtonsSessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonsSessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonsSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
