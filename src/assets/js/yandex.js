function showWidget(confirmationToken, backUrl) {
    //Инициализация виджета. Все параметры обязательные.
    let url = backUrl;
    if(url == null) {
        url = 'yandex.ru';
    }
    const checkout = new window.YandexCheckout({
        confirmation_token: confirmationToken, //Токен, который перед проведением оплаты нужно получить от Яндекс.Кассы
        return_url: backUrl, //Ссылка на страницу завершения оплаты
        error_callback(error) {
            console.log(error);
            //Обработка ошибок инициализации
        }
    });
    //Отображение платежной форме в заданном элементе
    checkout.render('payment-form');
}