import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleThemeComponent } from './title-theme.component';

describe('TitleThemeComponent', () => {
  let component: TitleThemeComponent;
  let fixture: ComponentFixture<TitleThemeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TitleThemeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TitleThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
