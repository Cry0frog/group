import { Component, OnInit, Input } from '@angular/core';
import { ShortComment } from 'src/app/models/partner/shortComment';
import { PartnerService } from 'src/app/components/partner/service/partner.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-task-comments-wrapper',
  templateUrl: './task-comments-wrapper.component.html',
  styleUrls: ['./task-comments-wrapper.component.css']
})
export class TaskCommentsWrapperComponent implements OnInit {
  shortComments: ShortComment[];

  @Input() taskId: number;

  constructor(private partnerService: PartnerService,
    private authService: AuthService) { }

  ngOnInit() {
    this.shortComments = [];
    this.loaderTaskComments();
  }

  loaderTaskCommentsHandler(event) {
    this.loaderTaskComments();
  }

  loaderTaskComments() {
    this.partnerService.getTaskComments(this.taskId).subscribe((date: ShortComment[]) => {
      this.shortComments = date;
    });
  }
}
