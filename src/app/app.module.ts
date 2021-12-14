import { PartnerModule } from './components/partner/partner.module';
import { AuthService } from './auth/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule,  MatFormFieldModule,
  MatInputModule, MatOptionModule,
  MatSelectModule, MatDatepickerModule,
  MatNativeDateModule, MatCheckboxModule } from '@angular/material';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { SharedModuleModule } from './components/shared-module/shared-module.module';
import {MatPaginatorIntl} from '@angular/material';
import { getDutchPaginatorIntl } from './components/admin/components/users-area/users/paginator';
import { PaymentComponent } from './components/partner/components/payment/payment.component';
import { SubscriptionPayComponent } from './components/partner/components/profile/subscription-pay/subscription-pay.component';
import { SubscriptionNotEnoughMoneyComponent } from './components/partner/components/profile/subscription-pay/subscription-not-enough-money/subscription-not-enough-money.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }), AppRoutingModule,
    FormsModule, HttpClientModule,
    MatDialogModule, BrowserAnimationsModule,
    MatFormFieldModule, MatInputModule,
    MatOptionModule, MatSelectModule,
    MatDatepickerModule, NgxMaterialTimepickerModule,
    MatNativeDateModule, MatCheckboxModule,
    SharedModuleModule, PartnerModule
  ],
  entryComponents: [PaymentComponent, SubscriptionPayComponent, SubscriptionNotEnoughMoneyComponent],
  providers: [AuthService, CookieService,
    { provide: MatPaginatorIntl, useValue: getDutchPaginatorIntl() },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
