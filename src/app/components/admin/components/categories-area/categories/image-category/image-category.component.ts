import { Component, OnInit, Inject } from '@angular/core';
import { Category } from 'src/app/models/category/category';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AdminService } from '../../../../service/admin.service';
import { ResorceUploadState } from 'src/app/models/common/resorceUploadState';
import { ResourceUploadStatus } from 'src/app/models/common/resourceUploadStatus';

@Component({
  selector: 'app-image-category',
  templateUrl: './image-category.component.html',
  styleUrls: ['./image-category.component.css']
})
export class ImageCategoryComponent implements OnInit {
  errorMessage: string;

  constructor(private adminService: AdminService,
    public dialogRef: MatDialogRef<ImageCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Category) { }

  ngOnInit() {}

  onNoClick(): void {
    return this.dialogRef.close();
  }

  loadImage(fd) {
    this.adminService.updateImgCategory(fd.file, this.data.id).subscribe((el: ResorceUploadState) => {
      if(el != null) {
        if(el.status === ResourceUploadStatus.INVALID_TYPE) {
          this.errorMessage = el.message;
        }
        else if(el.status === ResourceUploadStatus.SIZE_LIMIT) {
          this.errorMessage = el.message;
        }
        else if(el.status === ResourceUploadStatus.OK) {
          this.dialogRef.close(this.data);
        }
      }
    });
  }
}
