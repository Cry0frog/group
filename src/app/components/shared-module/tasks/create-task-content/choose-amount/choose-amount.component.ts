import { CommonService } from 'src/app/common/services/common.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TaskRequest } from 'src/app/models/task/taskRequest';
import { SessionStorageService } from 'angular-web-storage';

@Component({
  selector: 'app-choose-amount',
  templateUrl: './choose-amount.component.html',
  styleUrls: ['./choose-amount.component.css']
})
export class ChooseAmountComponent implements OnInit {

  newPrice: number;

  constructor(public dialogRef: MatDialogRef<ChooseAmountComponent>,
    private commonService: CommonService,
    private sessionStorage: SessionStorageService,
    @Inject(MAT_DIALOG_DATA) public data: TaskRequest) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleTaskRequestError(error: any) {
    this.data.isError = true;
    this.data.errors = error.errors;
  }

  dialogClosed() {
    if(this.data.ownerTask) {
      this.data.readyToPayPartner = this.newPrice;
    }
    else {
      this.data.readyToPayPerformer = this.newPrice;
    }

    if(this.data.id == null) {
      return this.dialogRef.close(this.data);
    }

    this.sendNewPrice();
  }

  sendNewPrice() {
    this.commonService.setNewPrice(this.data).subscribe((resp: any) => {
      if(resp.ok != null && resp.ok == false) {
        this.handleTaskRequestError(resp.error);
        return;
      }

      this.sessionStorage.remove('send_task_request');
      this.dialogRef.close(this.data);
    });
  }

}
