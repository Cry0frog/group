import { ErrorHandler } from '../error/errorHandler';

export class ShortComment extends ErrorHandler {

    constructor() {
        super();
    }

    id: number;
    assessment: number;
    date: Date;
    comment: string;
    nameCommentator: string;

    idCommented: number;
    idCommentator: number;
    taskId: number;
    taskName: string;

    isPartner: boolean;

    static convertToObj(obj: any): ShortComment {
      if(obj == null) {
        return null;
      }
      const shortComment: ShortComment = new ShortComment();
      Object.assign(shortComment, obj);
      return shortComment;
    }
}   