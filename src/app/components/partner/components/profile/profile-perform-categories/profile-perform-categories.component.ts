import { Component, Input, OnInit } from '@angular/core';
import { PartnerService } from '../../../service/partner.service';
import { ShortCategory } from 'src/app/models/partner/shortCategory';
import { SessionStorageService } from 'angular-web-storage';

@Component({
  selector: 'app-profile-perform-categories',
  templateUrl: './profile-perform-categories.component.html',
  styleUrls: ['./profile-perform-categories.component.css']
})
export class ProfilePerformeCategoriesComponent implements OnInit {
  @Input() partnerId: number;
  newShortCategory: ShortCategory;

  constructor(private partnerService: PartnerService,
    private sessionStorage: SessionStorageService) {
    this.newShortCategory = new ShortCategory();
  }

  ngOnInit() {
  }

  deleteUserCategory(id) {
    this.partnerService.deleteUserCategory(id).subscribe(el => {});
  }

  addUserCategory(newShortCategory) {
    this.newShortCategory = newShortCategory;
    this.newShortCategory.isError = false;
    this.partnerService.addUserCategory(this.newShortCategory).subscribe((el: any) => {
      if(el.ok != null && el.ok == false) {
        this.handleAddShortCategoryError(el.error);
        return;
      }

      this.sessionStorage.remove('update_content__update_partner_info');
    });
  }


  handleAddShortCategoryError(error: any) {
    this.newShortCategory.isError = true;
    this.newShortCategory.errors = error.errors;
  }

}
