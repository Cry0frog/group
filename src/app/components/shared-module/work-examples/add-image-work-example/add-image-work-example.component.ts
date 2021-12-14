import { SessionStorageService } from 'angular-web-storage';
import { PartnerService } from 'src/app/components/partner/service/partner.service';
import { ImageWorkExample } from 'src/app/models/image_work_example/imageWorkExample';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ResourceUploadStatus } from 'src/app/models/common/resourceUploadStatus';
import { AuthService } from 'src/app/auth/auth.service';
import { ResorceUploadState } from 'src/app/models/common/resorceUploadState';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-add-image-work-example',
  templateUrl: './add-image-work-example.component.html',
  styleUrls: ['./add-image-work-example.component.css']
})
export class AddImageWorkExampleComponent implements OnInit {
  errorMessage: string
  eventProgress: number;
  isUploadFileUpdate: boolean;

  constructor(private partnerService: PartnerService,
    private authService: AuthService,
    private sessionStorage: SessionStorageService,
    public dialogRef: MatDialogRef<AddImageWorkExampleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ImageWorkExample) { }

  ngOnInit() {
  }

  getCurrentPartnerId() {
    return this.authService.getCurrentId;
  }

  loadImage(fd) {
    if(this.data.isImageForTask && !this.data.isUpdateTask) {
      this.data.croppedImg = fd;
      return this.dialogRef.close(this.data);
    }

    this.isUploadFileUpdate = true;
    this.partnerService.updatePartnerImage(fd.file, this.getCurrentPartnerId(), this.data.taskId, this.data).subscribe(
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
              this.sessionStorage.set(AuthService.SCROLL_VALUE, true)
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
