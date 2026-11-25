import gestia from '../../assets/gestia-screen.png'
import shop from '../../assets/shop-screen.png'

export const landingExample = {
  id: 'gestia',
  name: 'Гестия',
  type: 'Лендинг услуг',
  image: gestia,
  task: 'Помочь посетителю выбрать уборку и перейти к обращению.',
  scenario: 'Выберите услугу — она подставится в форму заявки.',
  note: 'Демо готовит текст для копирования и не отправляет заявку.',
  repository: 'https://github.com/GrigValera/gestia-cleaning',
  preview: { url: 'https://grigvalera.github.io/gestia-cleaning/', label: 'Открыть демо' },
}

export const works = [
  landingExample,
  {
    id: 'mymyshop',
    name: 'MyMyShop',
    type: 'Интернет-магазин',
    image: shop,
    task: 'Показать товары и довести покупателя от каталога до корзины.',
    scenario: 'Откройте каталог, карточку товара и корзину.',
    note: 'Публичное оформление заказа пока недоступно.',
    repository: 'https://github.com/GrigValera/MyMyShop',
    preview: { url: 'https://grigvalera.github.io/MyMyShop/', label: 'Открыть витрину' },
  },
]
