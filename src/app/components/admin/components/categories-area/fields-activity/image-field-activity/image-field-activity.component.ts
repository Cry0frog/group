import { FieldActivity } from './../../../../../../models/field-activity/fileldActivity';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AdminService } from 'src/app/components/admin/service/admin.service';
import { ResorceUploadState } from 'src/app/models/common/resorceUploadState';
import { ResourceUploadStatus } from 'src/app/models/common/resourceUploadStatus';

@Component({
  selector: 'app-image-field-activity',
  templateUrl: './image-field-activity.component.html',
  styleUrls: ['./image-field-activity.component.css']
})
export class ImageFieldActivityComponent implements OnInit {
  errorMessage: string;

  constructor(private adminService: AdminService,
    public dialogRef: MatDialogRef<ImageFieldActivityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FieldActivity) { }

  ngOnInit() {}

  onNoClick(): void {
    return this.dialogRef.close();
  }

  loadImage(fd) {
    this.adminService.updateImgFieldActivity(fd.file, this.data.id).subscribe((data: ResorceUploadState) => {
      if(data != null) {
        if(data.status === ResourceUploadStatus.OK) {
          this.dialogRef.close(this.data);
        }
        else {
          this.errorMessage = data.message;
        }
      }
    });
  }}
