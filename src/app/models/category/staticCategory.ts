export class StaticCategory {
  constructor(name?: string, pathImage?: string) {
    this.name = name;
    this.pathImage = pathImage;
  }

  name: string;
  pathImage: string;

  getAllStaticCategories(): StaticCategory[] {
    return [
      new StaticCategory("Грузоперевозки и услуги грузчиков", "/src/assets/img/image_static_categories/category_3109_1937982388"),
      new StaticCategory("Курьерские доставки", "/src/assets/img/image_static_categories/category_3105_455457261"),
      new StaticCategory("Покупка любого товара с доставкой на дом", "/src/assets/img/image_static_categories/category_3101_455457261"),
      new StaticCategory("Попутный груз, корреспонденция", "/src/assets/img/image_static_categories/category_3116_-1132015408"),
      new StaticCategory("Поиск попутчиков", "/src/assets/img/image_static_categories/category_3126_-1804187850"),
      new StaticCategory("Ремонт, строительство", "/src/assets/img/image_static_categories/category_856_455457261"),
      new StaticCategory("Красота и здоровье", "/src/assets/img/image_static_categories/category_401_455457261"),
      new StaticCategory("Всё для автомобилей", "/src/assets/img/image_static_categories/category_446_-1280553247"),
      new StaticCategory("Образование", "/src/assets/img/image_static_categories/category_359_455457261"),
      new StaticCategory("Юриспруденция, бухгалтерия", "/src/assets/img/image_static_categories/category_379_455457261"),
      new StaticCategory("Помощь с компьютерной/цифровой/свето-звуковой техникой", "/src/assets/img/image_static_categories/category_929_455457261"),
      new StaticCategory("Фото/видео/полиграфические услуги", "/src/assets/img/image_static_categories/category_559_455457261"),
      new StaticCategory("Одежда, обувь, аксессуары", "/src/assets/img/image_static_categories/category_9290_-1234334851"),
      new StaticCategory("Мероприятия и праздники", "/src/assets/img/image_static_categories/category_688_455457261"),
      new StaticCategory("Ремонт и установка бытовой/садовой/строительной техники", "/src/assets/img/image_static_categories/category_524_455457261"),
      new StaticCategory("Кулинария", "/src/assets/img/image_static_categories/category_978_455457261"),
      new StaticCategory("Помощь в уборке и домашних делах", "/src/assets/img/image_static_categories/category_759_455457261"),
      new StaticCategory("Разработка программного обеспечения и WEB-сервисов", "/src/assets/img/image_static_categories/category_606_455457261"),
      new StaticCategory("Работы с текстом", "/src/assets/img/image_static_categories/category_713_455457261"),
      new StaticCategory("Дизайн", "/src/assets/img/image_static_categories/category_631_-1601619777"),
      new StaticCategory("Реклама", "/src/assets/img/image_static_categories/category_663_455457261"),
      new StaticCategory("Туристические услуги", "/src/assets/img/image_static_categories/category_59_455457261"),
      new StaticCategory("Услуги спецтехники", "/src/assets/img/image_static_categories/category_734_455457261"),
      new StaticCategory("Ритуальные услуги", "/src/assets/img/image_static_categories/category_332_455457261"),
      new StaticCategory("Охрана и безопасность", "/src/assets/img/image_static_categories/category_185_455457261"),
      new StaticCategory("Контроль качества", "/src/assets/img/image_static_categories/category_648_455457261"),
      new StaticCategory("Услуги творческой направленности", "/src/assets/img/image_static_categories/category_1019_455457261")
    ];
  }
}
