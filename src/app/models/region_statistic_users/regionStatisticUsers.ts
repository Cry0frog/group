export class RegionStatisticUsers {
  constructor() {
    this.osmIds = [];
  }

  osmIds: number[];
  countReg: number;

  public static convertToObj(obj): RegionStatisticUsers {
    if(obj == null) {
      return null;
    }

    const statstic = new RegionStatisticUsers();
    Object.assign(statstic, obj);
    return statstic;
  }
}
