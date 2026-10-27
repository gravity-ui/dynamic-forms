[← К оглавлению](./README.md)

# Kit

Готовый реестр на `@gravity-ui/uikit`: лейауты, 30 ключей сущностей на 6 типов узла, служебные компоненты. Экспортируется как `config`, рядом `untypedConfig` для `createNodeParametersDefiner`.

## Лейауты

Ключи одинаковы для всех типов узла. В форме строка и колонка — `FormRow` и `FormColumn`, в обзоре — `OverviewRow` и `OverviewColumn`; остальные общие. Размер контролов — из `settings.size`.

| Ключ          | Форма                           | Обзор                           | Props                                                            |
| :------------ | :------------------------------ | :------------------------------ | :--------------------------------------------------------------- |
| `row`         | Подпись слева, контрол справа   | Подпись, точки, значение        | `descriptionType`: tooltip или bottom                            |
| `column`      | Подпись сверху                  | Подпись сверху, значение снизу  | Тот же `descriptionType`                                         |
| `section`     | Заголовок секции                | То же, пустое скрывается        | `withIndent`, пропсы Text                                        |
| `card`        | Карточка, по умолчанию раскрыта | То же                           | `likeAccordeon`, `descriptionType`, пропсы Card                  |
| `accordeon`   | Disclosure                      | То же                           | `withIndent`, `titleProps`, `togglerProps`, `withDefaultSummary` |
| `transparent` | Контрол и ошибка                | Контрол, пустое скрывается      | `hideEmpty`                                                      |
| `cell`        | Тот же Transparent              | Transparent, `hideEmpty: false` | Для ячейки таблицы                                               |

## Каталог сущностей

Ключ пишется в `nodeParameters.entity`. Тип узла должен совпасть с веткой конфига.

### string

| Ключ                       | Форма                                | Обзор                                         | Props сущности                                                               |
| :------------------------- | :----------------------------------- | :-------------------------------------------- | :--------------------------------------------------------------------------- |
| `base`                     | TextInput                            | Текст                                         | Пропсы TextInput, кроме value и onUpdate                                     |
| `textarea`                 | Многострочный ввод                   | Текст                                         | Пропсы TextArea                                                              |
| `password`                 | Пароль                               | Текст (в обзоре открыт — ставьте `writeOnly`) | Пропсы PasswordInput                                                         |
| `select`                   | Один вариант из enum                 | Сырое значение                                | `enumDescriptions`, `optionsMeta`, `filterPlaceholder`                       |
| `radio_group`              | Радио из enum                        | Сырое значение                                | `enumDescriptions`, `optionsDisabled`                                        |
| `segmented_radio_group`    | Сегменты из enum, иначе select       | Сырое значение                                | `enumDescriptions`, `optionsDisabled`                                        |
| `color_picker`             | Выбор цвета                          | Образец цвета                                 | Пропсы ColorPicker                                                           |
| `file_input`               | Файл, drag-and-drop                  | Текст                                         | `readAsMethod`: readAsText, readAsDataURL, readAsBinaryString                |
| `monaco_input`             | Редактор кода                        | Только чтение                                 | `language`, `withDialog`. Компонент из `userContext.MonacoEditor`            |
| `string_number_with_scale` | Число строкой + единицы              | Значение в единице `viewType`                 | `scale {title, factor}`, `defaultType`, `viewType`. Границы в `stringNumber` |
| `alert`                    | Алерт, сворачивается по `flags.open` | Тот же алерт                                  | Пропсы Alert, `iconName`, `iconProps`                                        |
| `label`                    | Метка                                | Метка                                         | Пропсы Label, `iconName`                                                     |
| `text_content`             | Текст с темой clear                  | То же                                         | `title`, `iconName`                                                          |

### any

| Ключ   | Форма      | Обзор | Props сущности                                                             |
| :----- | :--------- | :---- | :------------------------------------------------------------------------- |
| `date` | DatePicker | Дата  | `format`, `outputFormat`, `timeZone`. Тип узла any, `schema.type` не задан |

### number

| Ключ                | Форма                    | Обзор              | Props сущности                                                    |
| :------------------ | :----------------------- | :----------------- | :---------------------------------------------------------------- |
| `base`              | Числовой инпут           | Текст              | Пропсы NumberInput. Границы из `minimum`, `maximum`, `multipleOf` |
| `slider`            | Слайдер, шаг 1           | Текст              | Пропсы Slider                                                     |
| `number_with_scale` | Число × factor + единицы | Значение в единице | `scale` с числовым factor, `defaultType`, `viewType`              |

### boolean

| Ключ     | Форма         | Обзор | Props сущности                                              |
| :------- | :------------ | :---- | :---------------------------------------------------------- |
| `base`   | Чекбокс       | Текст | В обзоре `valueDescriptions` и `viewColor` для true и false |
| `switch` | Переключатель | Текст | Пропсы Switch                                               |

### array

| Ключ             | Форма                        | Обзор              | Props сущности                                                    |
| :--------------- | :--------------------------- | :----------------- | :---------------------------------------------------------------- |
| `base`           | Список + кнопка добавления   | Список или прочерк | `addButtonText`. Кортеж `items[]` фиксирован, кнопок нет          |
| `table`          | Таблица объектов             | Таблица            | `order`, `addButtonText`. Колонки из `items.properties`           |
| `select`         | Мультиселект по `items.enum` | Список значений    | `enumDescriptions`, `optionsMeta`                                 |
| `checkbox_group` | Группа чекбоксов             | Список значений    | `enumDescriptions`, `optionsDisabled`, `direction` row или column |

### object

| Ключ            | Форма                     | Обзор             | Props сущности                                                |
| :-------------- | :------------------------ | :---------------- | :------------------------------------------------------------ |
| `base`          | Дети по `properties`      | Те же дети        | `order`, `groups`. independent: лейаут ставит сама сущность   |
| `inline`        | Дети в одну строку        | Та же строка      | `delimiter` строкой или словарём, `order`                     |
| `dot_value`     | Только `properties.value` | То же или прочерк | Пустое значение и строки `*_UNSPECIFIED` сбрасывают объект    |
| `one_of_nested` | Ровно одна ветка          | Выбранная ветка   | `toggler`, `order`, `withIndent`, `booleanToKey`. independent |
| `few_of_nested` | Несколько веток           | Выбранные ветки   | `toggler`, `order`, `withIndent`. independent                 |
| `range_input`   | Два поля, from ≤ to       | Диапазон          | `propertyKeys`, `separator`. Патчит `minimum` и `maximum`     |
| `range_slider`  | Слайдер диапазона         | Диапазон          | `propertyKeys`                                                |

## Служебные компоненты

Из них собираются лейауты и сущности; пригодятся в своих компонентах (см. [Расширение](./extension.md)).

| Компонент                                         | Роль                                                           |
| :------------------------------------------------ | :------------------------------------------------------------- |
| `LayoutContainer`                                 | Обёртка лейаута: `flags.hidden`, hideEmpty, место под кнопки.  |
| `EntityContainer`                                 | Ширина, флаг droppable, состояние заполненности.               |
| `EntityTitle`                                     | Заголовок из `title`, звёздочка для required. Пустой — null.   |
| `EntityDescription`                               | Описание из `description` рядом или снизу.                     |
| `EntityError`                                     | Текст ошибки, когда поле touched или submit не прошёл.         |
| `HTMLContent`                                     | HTML/MD через `RenderHTMLOrMD` либо `dangerouslySetInnerHTML`. |
| `LayoutButtons`                                   | Кнопки строки: удалить элемент массива, копировать, сбросить.  |
| `ArrayRemoveButton` / `CopyButton` / `DropButton` | Отдельные кнопки для своих лейаутов.                           |
| `EmptyEntityValue`                                | Прочерк для пустого значения в обзоре.                         |
| `LongValue`                                       | Длинный текст с раскрытием по клику.                           |
| `MonacoContainer`                                 | Рамка редактора с полноэкранным диалогом.                      |

## Кнопки и пустые значения

- **Удаление и сброс.** Элемент однородного массива в форме получает кнопку удаления; элемент кортежа — нет. Пустой массив после удаления остаётся `[]`. Необязательное поле объекта получает меню сброса: пишет `undefined`, у последнего ключа — `{}` родителю.
- **Пусто в обзоре.** Пустое значение — прочерк `DASH` через `EmptyEntityValue`. Лейауты обзора скрываются, если внутри нет заполненного значения (CSS `:has([data-fill='populated'])`); исключение — `cell`.

### oneOf и fewOf

Переключатель описан целиком в `entityProps.toggler` и в значение формы не попадает. В значении остаётся объект, ключи которого — выбранные ветки. `one_of_nested` хранит один ключ (булев переключатель переводится через `booleanToKey`), `few_of_nested` — несколько.

### Объект: order и groups

`order` — имена свойств или пары `name` + `schemaPath`, если ребёнок лежит глубже `properties`. `groups` рисуют заголовок своим лейаутом и перечисляют те же поля; группа значение не регистрирует.

## Стили

Классы с префиксом `sr-`, темизация через переменные `@gravity-ui/uikit`. В режиме `view: 'fit'` контейнер с `width: max` ограничен до 450px.
