import { PaymentService } from 'src/app/common/services/payment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pay-redirect-wrapper',
  templateUrl: './pay-redirect-wrapper.component.html',
  styleUrls: ['./pay-redirect-wrapper.component.css']
})
export class PayRedirectWrapperComponent implements OnInit {

  constructor(private activeRoute: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService) { }

  ngOnInit() {
    const backUrl = this.activeRoute.snapshot.queryParams['url'];
    if(this.activeRoute.snapshot.queryParams['task_id'] != null) {
      const taskId = parseInt(this.activeRoute.snapshot.queryParams['task_id']);
      this.paymentService.markTaskAsPayed(taskId).subscribe( _ => {
        this.router.navigate([backUrl]);
      });
    }
    else if(this.activeRoute.snapshot.queryParams['payment_id'] != null) {
      const paymentId = this.activeRoute.snapshot.queryParams['payment_id'];
      this.paymentService.markRefillAsPayed(paymentId).subscribe( _ => {
        this.router.navigate([backUrl]);
      });
    }
  }

}
