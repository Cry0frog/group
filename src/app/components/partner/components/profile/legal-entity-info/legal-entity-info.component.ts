import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LegalEntityInfo } from 'src/app/models/legal-entity-info/legalEntityInfo';
import { Router } from '@angular/router';

@Component({
  selector: 'app-legal-entity-info',
  templateUrl: './legal-entity-info.component.html',
  styleUrls: ['./legal-entity-info.component.css']
})
export class LegalEntityInfoComponent implements OnInit {
  originFileName: string;

  @Input() legalEntityInfo: LegalEntityInfo;
  @Input() partnerId: number;
  @Output() getCurrentLegalEntityInfoEvent = new EventEmitter<{}>();

  constructor(public router: Router) { }

  ngOnInit() {
  }
}
