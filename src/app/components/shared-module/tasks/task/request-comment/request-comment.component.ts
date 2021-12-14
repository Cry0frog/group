import { Component, OnInit, Inject } from '@angular/core';
import { PartnerService } from 'src/app/components/partner/service/partner.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ShortComment } from 'src/app/models/partner/shortComment';
import { SessionStorageService } from 'angular-web-storage';

@Component({
  selector: 'app-request-comment',
  templateUrl: './request-comment.component.html',
  styleUrls: ['./request-comment.component.css']
})
export class RequestCommentComponent implements OnInit {
  rightNow: boolean;
  newShortComment: ShortComment;

  constructor(private partnerService: PartnerService,
    private sessionStorage: SessionStorageService,
    public dialogRef: MatDialogRef<RequestCommentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ShortComment) { }

  ngOnInit() {
    this.rightNow = false;
    this.newShortComment = new ShortComment();
  }

  onNoClick(): void {
    return this.dialogRef.close();
  }

  addCommentRightNow() {
    this.rightNow = true;
  }

  isChangeStar(assessment: number) {
    this.newShortComment.assessment = assessment;
  }

  handleAddShortCommentError(error: any) {
    this.newShortComment.isError = true;
    this.newShortComment.errors = error.errors;
  }

  addComment() {
    this.newShortComment.isError = false;
    this.newShortComment.idCommented = this.data.idCommented;
    this.newShortComment.taskId = this.data.taskId;
    this.partnerService.addPartnerComment(this.newShortComment).subscribe((el: any) => {
      if(el.ok != null && el.ok == false) {
        this.handleAddShortCommentError(el.error);
        return;
      }

      this.sessionStorage.remove('update_content__update_partner_info');
      this.dialogRef.close();
    });
  }
}
