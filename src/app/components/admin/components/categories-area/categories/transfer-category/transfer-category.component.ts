import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Category } from 'src/app/models/category/category';
import { AdminService } from '../../../../service/admin.service';

@Component({
  selector: 'app-transfer-category',
  templateUrl: './transfer-category.component.html',
  styleUrls: ['./transfer-category.component.css']
})
export class TransferCategoryComponent implements OnInit {
  folderCategories: Category[];
  selectedCategory: any;
  isRootNull: boolean;
  selectedValueOption1 = "option1"

  constructor(public dialogRef: MatDialogRef<TransferCategoryComponent>,
    private adminService: AdminService,
    @Inject(MAT_DIALOG_DATA) public data: Category) { }

  ngOnInit() {
    this.isRootNull = false;
    this.folderCategories = [];
    this.getAllFolderCategories();
  }

  getAllFolderCategories() {
    this.adminService.getAllFolderCategories().subscribe((data: Category[]) => {
      if(this.data.root != null) {
        this.folderCategories = data.filter((el: Category) => el.id != this.data.root.id);
      }
      else {
        this.folderCategories = data;
        this.isRootNull = true;
      }
    });
  }

  saveSelect() {
    if(this.selectedCategory == this.selectedValueOption1) {
      this.data.root = null;
    }
    else {
      this.data.root = this.selectedCategory;
    }
  }

  get sortedArray(): Category[] {
    return this.folderCategories.sort((a, b) => {
       return a.id - b.id;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
