import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { RatingComponent } from '@quotes-app/quotes/ui';

describe('RatingComponent', () => {
  let component: RatingComponent;
  let fixture: ComponentFixture<RatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RatingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RatingComponent);
    component = fixture.componentInstance;
    component.currentRating = 3;
    fixture.detectChanges();
  });

  it('should render five stars', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons.length).toBe(5);
  });

  it('should emit ratingChange on click', () => {
    jest.spyOn(component.ratingChange, 'emit');

    const thirdStar = fixture.debugElement.queryAll(By.css('button'))[2];
    thirdStar.triggerEventHandler('click');

    expect(component.ratingChange.emit).toHaveBeenCalledWith(3);
  });
});

