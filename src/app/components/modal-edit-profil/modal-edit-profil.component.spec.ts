import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditProfilComponent } from './modal-edit-profil.component';

describe('ModalEditProfilComponent', () => {
  let component: ModalEditProfilComponent;
  let fixture: ComponentFixture<ModalEditProfilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalEditProfilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEditProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
