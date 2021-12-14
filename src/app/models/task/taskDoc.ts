export class TaskDoc {
  constructor(file?, nameDoc?, order?) {
    this.file = file;
    this.nameDoc = nameDoc;
    this.order = order;
  }

  id: number;
  taskId: number;
  nameDoc: string;

  //ui
  file: FormData;
  order: number;

  public static convertToObj(obj): TaskDoc {
    if(obj == null) {
      return null;
    }

    const doc: TaskDoc = new TaskDoc();
    Object.assign(doc, obj);
    return doc;
  }
}
