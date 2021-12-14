import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';
import { VerificationRequest } from 'src/app/models/auth/verificationRequest';

@Component({
  selector: 'app-verification-request',
  templateUrl: './verification-request.component.html',
  styleUrls: ['./verification-request.component.css']
})
export class VerificationRequestComponent implements OnInit {

  verificationRequest: VerificationRequest;
  message: string;

  //timer
  min: string;
  sec: string;
  isShowTimer: boolean;

  repeatedRequest: boolean;

  constructor(private authService: AuthService,
    public dialogRef: MatDialogRef<VerificationRequestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.min = "03";
      this.sec = "00";
  }

  ngOnInit() {
    this.verificationRequest = new VerificationRequest();
    this.getVerificationRequest();
  }

  getVerificationRequest() {
    this.verificationRequest.channel = "sms";
    this.verificationRequest.to = this.data.phoneNumber;
    this.authService.verificationRequest(this.verificationRequest).subscribe(el => {
      this.isShowTimer = true;
      this.repeatedRequest = false;
      this.timer();

      if(el.error != null && el.error.message != null) {
        this.message = el.error.message;
      }
      else {
        this.message = null;
      }
    });
  }

  timer() {
    this.refreshTimer();
    setTimeout(() => {
      if(this.isShowTimer) {
        this.timer();
      }
    }, 1000);
  }

  refreshTimer() {
    let numberMin: number = parseInt(this.min);
    let numberSec: number = parseInt(this.sec);

    --numberSec;
    if(numberSec == -1) {
      numberSec = 59;
      --numberMin;
    }

    this.min = numberMin < 9 ? `0${numberMin}` : `${numberMin}`;
    this.sec = numberSec < 9 ? `0${numberSec}` : `${numberSec}`;

    if(numberMin == 0 && numberSec == 0) {
      this.isShowTimer = false;
      this.repeatedRequest = true;
      return;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
