import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveVisitorsComponent } from './live-visitors.component';

describe('LiveVisitorsComponent', () => {
  let component: LiveVisitorsComponent;
  let fixture: ComponentFixture<LiveVisitorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiveVisitorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveVisitorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
