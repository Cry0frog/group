import { PaymentTool } from '../../../../../models/walletone/tools/paymentTool';
import { PayService } from './../../../../../services/pay.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { Task } from 'src/app/models/task/task';
import { Router } from '@angular/router';
import { ActiveUrls } from 'src/app/auth/activeUrls';

@Component({
  selector: 'app-choose-pay-tool',
  templateUrl: './choose-pay-tool.component.html',
  styleUrls: ['./choose-pay-tool.component.css']
})
export class ChoosePayToolComponent implements OnInit {

  customerTools: PaymentTool[];
  isLoaded: boolean;

  constructor(public dialogRef: MatDialogRef<ChoosePayToolComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task,
    private payService: PayService,
    private router: Router
  ) {
    this.customerTools = [];
    this.isLoaded = false;
  }

  ngOnInit() {
    this.reloadTools();
  }

  isNewTask(): boolean {
    return this.router.url.match(ActiveUrls.NEW_TASK) ? true : false;
  }

  reloadTools() {
    this.payService.getCustomerPaymentTools(this.closeHandler).subscribe((tools: []) => {
      this.customerTools = tools;
      this.isLoaded = true;
    });
  }

  addPayTool() {
    this.payService.openPayBindingCustomerCard(this.data.id, this.closeHandler);
  }

  closeHandler = () => {
    this.dialogRef.close(null);
  };

  onToolChange($event) {
    const value = $event.value;
    if(value == null) {
      this.addPayTool();
    }
    this.payService.bindCustomerPaymentTool(this.data.id, value.PaymentToolId, value.Mask).subscribe(resp => {
      this.dialogRef.close(resp);
    });
  }

}
