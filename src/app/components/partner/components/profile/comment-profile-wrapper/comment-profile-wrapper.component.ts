import { Component, OnInit, Input } from '@angular/core';
import { ShortComment } from 'src/app/models/partner/shortComment';
import { PartnerService } from '../../../service/partner.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-comment-profile-wrapper',
  templateUrl: './comment-profile-wrapper.component.html',
  styleUrls: ['./comment-profile-wrapper.component.css']
})
export class CommentProfileWrapperComponent implements OnInit {
  shortComments: ShortComment[];

  @Input() partnerId: number;

  constructor(private partnerService: PartnerService,
    private authService: AuthService) { }

  ngOnInit() {
    this.shortComments = [];
    this.loaderProfileComments()
  }

  loaderProfileCommentsHandler(event) {
    this.loaderProfileComments();
  }

  loaderProfileComments() {
    this.partnerService.getPartnersComments(this.partnerId).subscribe((date: ShortComment[]) => {
      this.shortComments = date;
    });
  }
}
