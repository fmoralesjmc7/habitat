import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInformativoPrudentialComponent } from './modal-informativo-prudential.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ModalInformativoPrudentialComponent', () => {
  let component: ModalInformativoPrudentialComponent;
  let fixture: ComponentFixture<ModalInformativoPrudentialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalInformativoPrudentialComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalInformativoPrudentialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
