import { ActiveUrls } from 'src/app/auth/activeUrls';
import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { CommonService } from 'src/app/common/services/common.service';
import { ShortResume } from 'src/app/models/resume/shortResume';

@Component({
  selector: 'app-job-resume',
  templateUrl: './job-resume.component.html',
  styleUrls: ['./job-resume.component.css']
})
export class JobResumeComponent implements OnInit {

  @Input() lastThreeResume: ShortResume[];

  constructor(
    private commonService: CommonService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  openResumeList(){
    const url = this.router.serializeUrl(this.router.createUrlTree([ActiveUrls.FIND_RESUME]));
    window.open(url, '_blank');
  }

}
