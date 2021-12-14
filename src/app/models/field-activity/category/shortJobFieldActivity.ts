export class ShortFieldActivity {
  fieldActivityId: number;
  nameFieldActivity: string;

  public static convertToObj(obj): ShortFieldActivity {

    const dto: ShortFieldActivity = new ShortFieldActivity();
    Object.assign(dto, obj);

    return dto;
  }
}
