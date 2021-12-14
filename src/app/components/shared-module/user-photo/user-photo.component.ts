import { CroppedImg } from '../../../models/cropped_img/croppedImg';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-photo',
  templateUrl: './user-photo.component.html',
  styleUrls: ['./user-photo.component.css']
})
export class UserPhotoComponent implements OnInit {

  imageChangedEvent: any;
  croppedImage: any;
  fileExtension: any;
  fileOriginalName: any;

  croppedImg: CroppedImg;

  @Input() errorMessage: string;
  @Input() eventProgress: number;
  @Input() isUploadFileUpdate: boolean;
  @Output() updatePhotoEvent = new EventEmitter<CroppedImg>();
  @Output() closeDialogEvent = new EventEmitter();

  constructor() {
    this.imageChangedEvent = "";
    this.errorMessage = "";
    this.croppedImg = new CroppedImg();
  }

  ngOnInit() {
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.fileOriginalName = event.target.files[0].name;
    this.fileExtension = event.target.files[0].type;
  }

  imageCropped(image) {
    let blob = this.dataURItoBlob(image);
    var file = new File([blob], this.fileOriginalName, { type: this.fileExtension });

    this.croppedImg.imageBase64 = image.base64;
    this.croppedImage = file;
  }

  dataURItoBlob(dataURI) {
    let byteString;

    if (dataURI.base64.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(dataURI.base64.split(',')[1]);
    }
    else {
      byteString = unescape(dataURI.base64.split(',')[1]);
    }

    var mimeString = dataURI.base64.split(',')[0].split(':')[1].split(';')[0];
    var ia = new Uint8Array(byteString.length);

    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
  }

  onNoClick() {
    this.closeDialogEvent.emit();
  }

  loadImage() {
    const fd = new FormData();
    if(this.croppedImage != null) {
      fd.append('image', this.croppedImage, this.fileOriginalName);
    }

    this.croppedImg.file = fd;
    this.updatePhotoEvent.emit(this.croppedImg);
  }
}
