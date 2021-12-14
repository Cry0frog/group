import { ResourceUploadStatus } from './../../../../../../models/common/resourceUploadStatus';
import { DevelopmentService } from './../../../../service/development.service';
import { ResorceUploadState } from './../../../../../../models/common/resorceUploadState';
import { DevelopmentPartner } from './../../../../../../models/development/developmentPartner';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-update-photo-fake',
  templateUrl: './update-photo-fake.component.html',
  styleUrls: ['./update-photo-fake.component.css']
})
export class UpdatePhotoFakeComponent implements OnInit {

  errorMessage: string;

  constructor(private developmentService: DevelopmentService,
    public dialogRef: MatDialogRef<UpdatePhotoFakeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DevelopmentPartner) { }

  ngOnInit() {
  }

  loadImage(fd) {
    this.developmentService.updateDevelopmentPhoto(fd.file, this.data.id).subscribe((data: ResorceUploadState) => {
      if(data != null) {
        if(data.status === ResourceUploadStatus.INVALID_TYPE) {
          console.log(data.message);
          this.errorMessage = data.message;
        }
        else if(data.status === ResourceUploadStatus.SIZE_LIMIT) {
          console.log(data.message);
          this.errorMessage = data.message;
        }
        else if(data.status === ResourceUploadStatus.OK) {
          console.log(data.message);
          location.reload(true);
          this.dialogRef.close();
        }
      }
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }

}
