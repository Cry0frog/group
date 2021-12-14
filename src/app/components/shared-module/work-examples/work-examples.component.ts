import { AddImageWorkExampleComponent } from './add-image-work-example/add-image-work-example.component';
import { PartnerService } from 'src/app/components/partner/service/partner.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ImageWorkExample } from 'src/app/models/image_work_example/imageWorkExample';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-work-examples',
  templateUrl: './work-examples.component.html',
  styleUrls: ['./work-examples.component.css']
})
export class WorkExamplesComponent implements OnInit {

  @Input() images: ImageWorkExample[];
  @Input() isOwner: boolean;
  @Input() isTaskImages: boolean;
  @Input() taskId: number;
  @Input() disabledBtn: boolean;
  @Output() reloadPartnerInfoEvent = new EventEmitter();

  currentImage: ImageWorkExample;

  counterSwipe: number;

  constructor(private partnerService: PartnerService,
      public dialog: MatDialog) {
    this.currentImage = new ImageWorkExample();
  }

  ngOnInit() {
    this.counterSwipe = this.isOwner ? 0 : 1;
  }


  isDisabledSwipeNext(): boolean {
    return this.counterSwipe >= this.images.length;
  }

  isDisabledSwipePrev(): boolean {
    return (this.isOwner && this.counterSwipe == 0) || (!this.isOwner && this.counterSwipe - 1 == 0);
  }

  setValueTransform(): number {
    const addBtn: any = document.querySelector("#addImageBtn");
    return addBtn.offsetWidth;
  }

  swipeNext() {
    if(this.isDisabledSwipeNext()) {
      return;
    }

    const textArea: any = document.querySelector("#bestgallerys");
    if(textArea.style.transform != '') {
      const separators = [' ', '\\\(', '\\\)', '\\\,', 'px'];
      const currentValue = parseInt(textArea.style.transform.split(new RegExp(separators.join('|'), 'g'))[1]);
      textArea.style.transform = `translate3d(${currentValue - this.setValueTransform()}px, 0px, 0px)`

    }
    else {
      textArea.style.transform = `translate3d(${-this.setValueTransform()}px, 0px, 0px)`;
    }

    textArea.style.transitionDuration = "300ms"
    ++this.counterSwipe;
  }

  swipePrev() {
    if(this.isDisabledSwipePrev()) {
      return;
    }

    const  textArea: any = document.querySelector("#bestgallerys");
    if(textArea.style.transform != '') {
      const separators = [' ', '\\\(', '\\\)', '\\\,', 'px'];
      const currentValue = parseInt(textArea.style.transform.split(new RegExp(separators.join('|'), 'g'))[1]);
      textArea.style.transform = `translate3d(${currentValue + this.setValueTransform()}px, 0px, 0px)`

    }

    textArea.style.transitionDuration = "300ms"
    --this.counterSwipe;
  }

  setCurrentImage(image) {
    this.currentImage = image;
  }

  addImage() {
    const dialogRef = this.dialog.open(AddImageWorkExampleComponent, {
      width: '700px',
      data: new ImageWorkExample(this.isTaskImages, this.taskId != null, this.taskId)
    });
    dialogRef.afterClosed().subscribe((data: ImageWorkExample) => {
      if(data != null) {
        data.order = this.images.length + 1;
        this.images.push(data);
      }
    });
  }

  updateImage(image) {
    const imageCopy = new ImageWorkExample();
    Object.assign(imageCopy, image);
    imageCopy.isImageForTask = this.isTaskImages;
    imageCopy.isUpdateTask = this.taskId != null;
    imageCopy.taskId = this.taskId;
    const dialogRef = this.dialog.open(AddImageWorkExampleComponent, {
      width: '700px',
      height: '660px',
      data: imageCopy
    });
    dialogRef.afterClosed().subscribe((data: ImageWorkExample) => {
      if(data != null) {
        image = data;
      }
    });
  }

  deleteImage(image) {
    if(image.id != null) {
      this.partnerService.deleteImage(image.id).subscribe(() => this.images = this.images.filter(el => el.id != image.id));
    }
    else {
      this.images = this.images.filter(el => el.order != image.order);
    }
  }

  getSortImage(): ImageWorkExample[] {
    return this.images != null ? this.images.sort((a, b) => a.id == b.id ? b.order - a.order : b.id - a.id) : [];
  }

}
