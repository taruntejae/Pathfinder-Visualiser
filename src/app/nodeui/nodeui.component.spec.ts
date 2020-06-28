import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeuiComponent } from './nodeui.component';

describe('NodeuiComponent', () => {
  let component: NodeuiComponent;
  let fixture: ComponentFixture<NodeuiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeuiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeuiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
