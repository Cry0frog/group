import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentProfileWrapperComponent } from './comment-profile-wrapper.component';

describe('CommentProfileWrapperComponent', () => {
  let component: CommentProfileWrapperComponent;
  let fixture: ComponentFixture<CommentProfileWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentProfileWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentProfileWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
