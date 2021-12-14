import { CroppedImg } from '../cropped_img/croppedImg';

export class ImageWorkExample {
  constructor(isImageForTask?: boolean, isUpdateTask?: boolean, taskId?: number) {
    this.showImage = true;
    this.isImageForTask = false;
    this.order = 0;
    this.isImageForTask = isImageForTask;
    this.isUpdateTask = isUpdateTask;
    this.taskId = taskId;
  }

  id: number;
  partnerId: number;
  taskId: number;
  nameImg: string;
  showImage: boolean;

  //onlyUi
  croppedImg: CroppedImg;
  isImageForTask: boolean;
  isUpdateTask: boolean;
  order: number;

  static convertToObj(obj: any): ImageWorkExample {
    if(obj == null) {
      return null;
    }
    const image: ImageWorkExample = new ImageWorkExample();
    Object.assign(image, obj);
    return image;
  }
}
