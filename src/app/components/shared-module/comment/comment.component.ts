import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ShortComment } from 'src/app/models/partner/shortComment';
import { PartnerService } from '../../partner/service/partner.service';
import { SessionStorageService } from 'angular-web-storage';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  newShortComment: ShortComment;
  isChangeComment: boolean;

  @Input() shortComments: ShortComment[];
  @Input() partnerId: number;

  @Output() loaderCommentsEvent = new EventEmitter();

  constructor(private partnerService: PartnerService,
    private sessionStorage: SessionStorageService,
    private authService: AuthService) {}

  ngOnInit() {
    this.newShortComment = new ShortComment();
    this.isChangeComment = false;
  }

  get isMobileMode() {
    return this.authService.isMobileMode();
  }

  isChangeStar(assessment: number) {
    this.newShortComment.assessment = assessment;
  }

  editComment(shortComment: ShortComment) {
    if(this.isChangeComment) {
      this.isChangeComment = false;
    }
    else {
      this.isChangeComment = true;
      this.newShortComment = shortComment;
      setTimeout(() => {
        // @ts-ignore
        document.querySelector(`#reviewStars-input_1 #star-${this.newShortComment.assessment-1}`).click();
      }, 300);
    }
  }

  cancelEditComment() {
    this.newShortComment = new ShortComment();
    this.isChangeComment = false;
  }

  sendRequest(event) {
    if(this.isMobileMode && event != null) {
      return;
    }

    if(event != null) {
      event.preventDefault();
    }

    this.updatePartnerComment(this.newShortComment);
  }

  handleUpdateShortCommentError(error: any) {
    this.newShortComment = ShortComment.convertToObj(this.newShortComment);
    this.newShortComment.isError = true;
    this.newShortComment.errors = error.errors;
  }

  getCurrentId(): number {
    return this.authService.getCurrentId;
  }

  isYourProfile(): boolean {
    return this.partnerId == this.authService.getCurrentId;
  }

  isAnyComments(): boolean {
    return this.shortComments != null && this.shortComments.some(el => el.idCommentator == this.authService.getCurrentId);
  }

  deletePartnerComment(id) {
    this.partnerService.deletePartnerComment(id).subscribe(el => {
      this.loaderCommentsEvent.emit();
    });
  }

  updatePartnerComment(shortComment: ShortComment) {
    this.newShortComment.isError = false;

    this.partnerService.updatePartnersComments(shortComment).subscribe((el: any) => {
      if(el.ok != null && el.ok == false) {
        this.handleUpdateShortCommentError(el.error);
        return;
      }

      this.sessionStorage.remove('update_content__update_partner_info');

      this.isChangeComment = false;
      this.loaderCommentsEvent.emit();
    });
  }
}
