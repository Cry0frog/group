import { Component, OnInit, Input } from '@angular/core';
import { PartnerInfoWithCity } from 'src/app/models/partnerInfo/partnerInfoWithCity';

@Component({
  selector: 'app-partner-info',
  templateUrl: './partner-info.component.html',
  styleUrls: ['./partner-info.component.css']
})
export class PartnerInfoComponent implements OnInit {

  @Input() partnerInfo: PartnerInfoWithCity;

  constructor() { }

  ngOnInit() {
  }
}
