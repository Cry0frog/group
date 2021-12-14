import { HttpEventType } from '@angular/common/http';
import { ResourceUploadStatus } from './resourceUploadStatus';

export class ResorceUploadState {

    status: ResourceUploadStatus;
    message: string;
    refObjectId: number;

    public static httpResponseHandler(event): number {
      switch (event.type) {
        case HttpEventType.UploadProgress:
          if (event.total) {
            return Math.round((event.loaded / event.total) * 100);
          }
          break;
        case HttpEventType.Response:
          return 100;
      }
    }

}
