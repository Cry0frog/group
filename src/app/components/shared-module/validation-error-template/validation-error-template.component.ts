import { ErrorHandler } from './../../../models/error/errorHandler';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-validation-error-template',
  templateUrl: './validation-error-template.component.html',
  styleUrls: ['./validation-error-template.component.css']
})
export class ValidationErrorTemplateComponent implements OnInit {
  @Input() errorHandler: ErrorHandler;
  @Input() propertyTemplate: string;
  @Input() index: number;
  @Input() commonMessage: string;

  constructor() { }

  ngOnInit() {}

  isHaveError(): boolean {
    if(!this.errorHandler.isError) {
      return false;
    }

    if(this.commonMessage != null) {
      return true;
    }

    if(this.index == null) {
      return this.errorHandler.isHaveError(this.propertyTemplate);
    }
    else {
      return this.errorHandler.isHaveErrorForProps(this.propertyTemplate, this.index);
    }
  }

  getErrorDescr(): string {
    if(this.commonMessage != null) {
      return this.commonMessage;
    }

    if(this.index == null) {
      return this.errorHandler.getErrorDescr(this.propertyTemplate);
    }
    else {
      return this.errorHandler.getErrorDescrForProps(this.propertyTemplate, this.index);
    }
  }

}
