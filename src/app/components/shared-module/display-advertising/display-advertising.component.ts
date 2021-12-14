import { CommonService } from './../../../common/services/common.service';
import { Component, Input, OnInit } from '@angular/core';
import { PlaceAdvertising } from 'src/app/models/advertising/common/placeAdvertising';
import { ShortAdvertising } from 'src/app/models/advertising/shortAdvertising';
import { SessionStorageService } from 'angular-web-storage';

@Component({
  selector: 'app-display-advertising',
  templateUrl: './display-advertising.component.html',
  styleUrls: ['./display-advertising.component.css']
})
export class DisplayAdvertisingComponent implements OnInit {

  @Input() place: PlaceAdvertising;
  shortAdvertising: ShortAdvertising;
  placesWithoutCategory: PlaceAdvertising[];

  constructor(private commonService: CommonService,
    private sessionStorage: SessionStorageService) {
      this.shortAdvertising = new ShortAdvertising();
      this.placesWithoutCategory = [PlaceAdvertising.MEMBERS, PlaceAdvertising.USER_PROFILE];
  }

  ngOnInit() {
    this.loadAdvertising();
  }

  chooseCategoryHandler(categoryId: number) {
    this.shortAdvertising.categoryId = categoryId;
    if(this.sessionStorage.get("priority_for_advert") == null) {
      ++this.shortAdvertising.priority;
    }
    else {
      this.shortAdvertising.priority = this.sessionStorage.get("priority_for_advert") + 1;
    }

    this.loadAdvertising()
  }

  loadAdvertising() {
    this.shortAdvertising.placeAdvertising = this.place;
    this.commonService.getShortAdvertising(this.shortAdvertising).subscribe((data: ShortAdvertising) => {
      if(data != null) {
        //this.findPerformerComponent.shortAdvertising = data;
        this.shortAdvertising = data;

        if(!this.placesWithoutCategory.includes(this.place)) {
          this.sessionStorage.set("priority_for_advert", data.priority);
        }

        setTimeout(() => {
          //@ts-ignore
          document.getElementById("myFrame").src = data.advertising;
        }, 200);
      }
    });
  }
}
