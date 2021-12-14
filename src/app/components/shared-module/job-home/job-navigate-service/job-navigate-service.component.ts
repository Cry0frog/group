import { SessionStorageService } from 'angular-web-storage';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-job-navigate-service',
  templateUrl: './job-navigate-service.component.html',
  styleUrls: ['./job-navigate-service.component.css']
})
export class JobNavigateServiceComponent implements OnInit {

  constructor( private sessionService: SessionStorageService) { }

  ngOnInit() {
  }

  navigateToHome(){
    this.sessionService.set(AuthService.GENERAL_NAV, false);
    window.open(`/home`, '_self');
  }

}
