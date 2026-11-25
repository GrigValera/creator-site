import gestia from '../../assets/gestia.svg'
import shop from '../../assets/shop.svg'

export const landingExample = {
  id: 'gestia',
  name: 'Гестия',
  type: 'Лендинг услуг',
  image: gestia,
  details: 'Задача — помочь посетителю подобрать уборку и перейти к заявке. В демо выберите услугу: она подставится в форму. Форма готовит текст для копирования.',
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
    details: 'Витрина, карточки товаров и корзина. Публичное оформление заказа пока недоступно.',
    repository: 'https://github.com/GrigValera/MyMyShop',
    preview: { url: 'https://grigvalera.github.io/MyMyShop/', label: 'Открыть витрину' },
  },
]
