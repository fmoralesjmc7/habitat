import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPrudentialFelicitacionesComponent } from './modal-prudential-felicitaciones.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ModalPrudentialFelicitacionesComponent', () => {
  let component: ModalPrudentialFelicitacionesComponent;
  let fixture: ComponentFixture<ModalPrudentialFelicitacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalPrudentialFelicitacionesComponent],
      providers: [],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPrudentialFelicitacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
