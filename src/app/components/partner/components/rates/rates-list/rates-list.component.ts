import { Component, OnInit } from '@angular/core';
import { PaymentService } from 'src/app/common/services/payment.service';
import { Commission } from 'src/app/models/payment/commission';

@Component({
  selector: 'app-rates-list',
  templateUrl: './rates-list.component.html',
  styleUrls: ['./rates-list.component.css']
})
export class RatesListComponent implements OnInit {
  commissions: Commission[];

  constructor(private paymentService: PaymentService) {

  }

  ngOnInit() {
    this.commissions = [];
    this.getAllCommissions();
  }

  getAllCommissions() {
    this.paymentService.getCommissions().subscribe((data: Commission[]) => {
      this.commissions = data;
    });
  }

}
