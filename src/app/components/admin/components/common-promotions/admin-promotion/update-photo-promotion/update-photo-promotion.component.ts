import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AdminService } from 'src/app/components/admin/service/admin.service';
import { Component, Inject, OnInit } from '@angular/core';
import { ResourceUploadStatus } from 'src/app/models/common/resourceUploadStatus';
import { ResorceUploadState } from 'src/app/models/common/resorceUploadState';
import { ShortPromotion } from 'src/app/models/promotion/shortPromotion';

@Component({
  selector: 'app-update-photo-promotion',
  templateUrl: './update-photo-promotion.component.html',
  styleUrls: ['./update-photo-promotion.component.css']
})
export class UpdatePhotoPromotionComponent implements OnInit {

  errorMessage: string;

  constructor(private adminService: AdminService,
    public dialogRef: MatDialogRef<UpdatePhotoPromotionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ShortPromotion) { }

  ngOnInit() {}

  onNoClick(): void {
    return this.dialogRef.close();
  }

  loadImage(fd) {
    this.adminService.updateImgPromotion(fd.file, this.data.id).subscribe((el: ResorceUploadState) => {
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
