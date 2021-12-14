import { ShortNews } from 'src/app/models/news/shortNews';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AdminService } from '../../../service/admin.service';
import { UpdatePhotoPromotionComponent } from '../../common-promotions/admin-promotion/update-photo-promotion/update-photo-promotion.component';
import { ResourceUploadStatus } from 'src/app/models/common/resourceUploadStatus';
import { ResorceUploadState } from 'src/app/models/common/resorceUploadState';

@Component({
  selector: 'app-update-photo-news',
  templateUrl: './update-photo-news.component.html',
  styleUrls: ['./update-photo-news.component.css']
})
export class UpdatePhotoNewsComponent implements OnInit {
  errorMessage: string;

  constructor(private adminService: AdminService,
    public dialogRef: MatDialogRef<UpdatePhotoPromotionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ShortNews) { }

  ngOnInit() {}

  onNoClick(): void {
    return this.dialogRef.close();
  }

  loadImage(fd) {
    this.adminService.updateImgNews(fd.file, this.data.id).subscribe((el: ResorceUploadState) => {
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
