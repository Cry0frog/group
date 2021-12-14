import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AdminService } from '../../../service/admin.service';
import { CategoryTree } from 'src/app/models/category/categoryTree';
import { IPlacesAdvertisingMapper, ADD_PLACES_ADVERTISING } from '../../../common/admin.descriptions';
import { PublicAdvertising } from 'src/app/models/advertising/publicAdvertising';
import { PlaceAdvertising } from 'src/app/models/advertising/common/placeAdvertising';

@Component({
  selector: 'app-add-advertising',
  templateUrl: './add-advertising.component.html',
  styleUrls: ['./add-advertising.component.css']
})
export class AddAdvertisingComponent implements OnInit {
  selectCategoryId: number;
  listAdvertises: PublicAdvertising[];
  listAddPriority: number[];
  listEditPriority: number[];
  rootCategories: CategoryTree[];
  addPlaces: IPlacesAdvertisingMapper[] = ADD_PLACES_ADVERTISING;

  constructor(public dialogRef: MatDialogRef<AddAdvertisingComponent>,
    private adminService: AdminService,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      this.rootCategories = [];
      this.listAddPriority = [];
      this.listEditPriority = [];
      this.listAdvertises = data.listAdvertises;
      this.selectCategoryId = data.publicAdvertising.categoryId;
    }

  ngOnInit() {
    this.getAllCategories();
    if(this.data.publicAdvertising.id != null) {
      for(let i: number = 1; i<=this.listAdvertises.filter(el => el.categoryId == this.data.publicAdvertising.categoryId && 
        el.placeAdvertising == this.data.publicAdvertising.placeAdvertising).length; ++i) {
        this.listAddPriority.push(i);
      }
    }
  }

  selectCategory(event) {
    if(event == -1) {
      this.data.publicAdvertising.priority = 0;
    }    
    this.data.publicAdvertising.placeAdvertising = null;
  }

  selectPlace(event) {
    const rootCategory = this.rootCategories.filter(el => el.id == this.selectCategoryId)[0];
    if(this.listAdvertises
      .filter(el => el.placeAdvertising == this.data.publicAdvertising.placeAdvertising && el.categoryId == this.selectCategoryId)
      .length == rootCategory.children.length) {
        this.selectCategoryId = null;
    }

    this.listAddPriority = [];
    if(this.selectCategoryId != null) {
      if(this.data.publicAdvertising.id == null) {
        for(let i: number = 1; i<=this.listAdvertises.filter(el => el.categoryId == this.selectCategoryId && 
          el.placeAdvertising == this.data.publicAdvertising.placeAdvertising).length + 1; ++i) {
          this.listAddPriority.push(i);
        }
      }
      else {
        if(this.selectCategoryId != this.data.publicAdvertising.categoryId) {
          for(let i: number = 1; i<=this.listAdvertises.filter(el => el.categoryId == this.selectCategoryId && 
            el.placeAdvertising == this.data.publicAdvertising.placeAdvertising).length + 1; ++i) {
            this.listAddPriority.push(i);
          }
        }
        else {
          for(let i: number = 1; i<=this.listAdvertises.filter(el => el.categoryId == this.selectCategoryId && 
            el.placeAdvertising == this.data.publicAdvertising.placeAdvertising).length; ++i) {
            this.listAddPriority.push(i);
          }
        }
      } 
    }
  }

  disabledCategory(categoryId): boolean {
    if(this.data.publicAdvertising.placeAdvertising != null) {
      const rootCategory = this.rootCategories.filter(el => el.id == categoryId)[0];
      if(this.listAdvertises
        .filter(el => el.placeAdvertising == this.data.publicAdvertising.placeAdvertising && el.categoryId == categoryId)
        .length == rootCategory.children.length) {
          return true;
      }
    }
    return false;
  }

  disabledPlace(place: PlaceAdvertising): boolean {
    if(this.selectCategoryId == null && this.listAdvertises.filter(el => el.placeAdvertising == place && el.categoryId == null).length != 0) {
      return true;
    }
    return false;
  }

  changeCategoryId() {
    this.data.publicAdvertising.categoryId = this.selectCategoryId;
  }

  isVisibleSelectionPriority(): boolean {
    return this.selectCategoryId != -1 && this.selectCategoryId != null && this.data.publicAdvertising.placeAdvertising != null;
  }

  getAllCategories() {
    this.adminService.getAllCategories().subscribe((data: CategoryTree[]) => {
      this.rootCategories = data.filter(el => el.folder);
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  get sortedPriority(): number[] {
    return this.listAddPriority.sort((a, b) => {
       return a - b;
    });
  }


}
