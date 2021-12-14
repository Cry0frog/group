import { ResourceUploadStatus } from './../../../../../models/common/resourceUploadStatus';
import { ResorceUploadState } from './../../../../../models/common/resorceUploadState';
import { PartnerInfoWithCity } from './../../../../../models/partnerInfo/partnerInfoWithCity';
import { PartnerService } from 'src/app/components/partner/service/partner.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, Inject, OnInit } from '@angular/core';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-edit-photo-profile',
  templateUrl: './edit-photo-profile.component.html',
  styleUrls: ['./edit-photo-profile.component.css']
})
export class EditPhotoProfileComponent implements OnInit {

  errorMessage: string;
  eventProgress: number;
  isUploadFileUpdate: boolean;


  constructor(private partnerService: PartnerService,
    public dialogRef: MatDialogRef<EditPhotoProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PartnerInfoWithCity) { }

  ngOnInit() {
  }

  loadImage(fd) {
    this.partnerService.updateUserPhoto(fd.file, this.data.idPartner).subscribe(
      (event: HttpEvent<any>) => {
        this.eventProgress = ResorceUploadState.httpResponseHandler(event)

        if(event.type == HttpEventType.Response) {
          this.isUploadFileUpdate = false;

          if(event.body != null) {
            if(event.body.status === ResourceUploadStatus.INVALID_TYPE) {
              console.log(event.body.message);
              this.errorMessage = event.body.message;
            }
            else if(event.body.status === ResourceUploadStatus.SIZE_LIMIT) {
              console.log(event.body.message);
              this.errorMessage = event.body.message;
            }
            else if(event.body.status === ResourceUploadStatus.OK) {
              console.log(event.body.message);
              location.reload(true);
              this.dialogRef.close();
            }
          }
        }
      }
    );
  }

  onNoClick() {
    this.dialogRef.close();
  }

}
