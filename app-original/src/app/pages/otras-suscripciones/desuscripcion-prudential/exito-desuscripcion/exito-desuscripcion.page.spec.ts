import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitoDesuscripcionPage } from './exito-desuscripcion.page';

describe('ExitoDesuscripcionPage', () => {
  let component: ExitoDesuscripcionPage;
  let fixture: ComponentFixture<ExitoDesuscripcionPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExitoDesuscripcionPage ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExitoDesuscripcionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
