import { PayService } from './../../../../../services/pay.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PaymentTool } from './../../../../../models/walletone/tools/paymentTool';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-choose-performer-pay-tool',
  templateUrl: './choose-performer-pay-tool.component.html',
  styleUrls: ['./choose-performer-pay-tool.component.css']
})
export class ChoosePerformerPayToolComponent implements OnInit {

  performerTools: PaymentTool[];
  isLoaded: boolean;

  constructor(public dialogRef: MatDialogRef<ChoosePerformerPayToolComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number,
    private payService: PayService
  ) {
    this.performerTools = [];
    this.isLoaded = false;
  }

  ngOnInit() {
    this.reloadTools();
  }

  reloadTools() {
    this.payService.getPerformerPaymentTools(this.closeHandler).subscribe((tools: []) => {
      this.performerTools = tools;
      this.isLoaded = true;
    });
  }

  addPayTool() {
    this.payService.openPayBindingPerformerCard(this.data, this.closeHandler);
  }

  closeHandler = () => {
    this.dialogRef.close(null);
  };

  onToolChange($event) {
    const value = $event.value;
    if(value == null) {
      this.addPayTool();
    }
    this.dialogRef.close(value);
  }

}
