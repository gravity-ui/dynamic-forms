[← К оглавлению](./README.md)

# Схема

Схема — это JSON Schema Draft-07 с двумя расширениями: `nodeParameters` (чем и как рисовать узел) и `stringNumber` (число, которое хранится строкой). Тип значения задаётся полем `type` (перечисление `JsonSchemaType`).

## nodeParameters

Единственное место, где схема говорит, чем её рисовать. `type` обязателен, если `entity` или `layout` заданы строкой: поиск идёт в `config[type]`. Вместо строки можно передать сам компонент.

| Поле                                       | Что задаёт                                                                                               |
| :----------------------------------------- | :------------------------------------------------------------------------------------------------------- |
| `type`                                     | `any`, `array`, `boolean`, `number`, `object`, `string`. Ветка конфига. Обязателен для строковых ключей. |
| `entity` / `formEntity` / `overviewEntity` | Ключ реестра или компонент. Специфичный режим перекрывает общий.                                         |
| `entityProps` + пары режимов               | Пропсы компонента поверх `defaultProps`. `formEntityProps` действует только с `formEntity`.              |
| `layout` / `formLayout` / `overviewLayout` | Ключ лейаута или компонент. Тот же порядок перекрытия.                                                   |
| `layoutProps` + пары режимов               | Пропсы лейаута.                                                                                          |
| `validator`                                | Ключ из `validators` этого типа или функция.                                                             |
| `errorMessages`                            | Тексты ошибок этого узла. Перекрывают словарь рендерера.                                                 |
| `flags`                                    | `copy`, `disabled`, `hidden`, `open`, `required`.                                                        |

### Порядок сборки кита

1. `entity` заполняет оба режима, затем `formEntity` / `overviewEntity` перекрывают свой.
2. Лейаут так же: `layout`, потом `formLayout` / `overviewLayout`.
3. `defaultProps` конфига сливаются с props схемы; props схемы остаются (массивы — по индексам).
4. При смене режима берутся только `formEntityProps` / `overviewEntityProps`, не общий `entityProps`.

> **independent.** У записи конфига `independent: true` лейаут уходит пропом внутрь сущности — движок её не оборачивает. Так сделаны `base`, `one_of_nested`, `few_of_nested` у объекта. Компонент, подставленный вместо строкового ключа, `defaultProps` и `independent` не получает.

## Флаги

| Флаг       | Эффект                                                                                                                   |
| :--------- | :----------------------------------------------------------------------------------------------------------------------- |
| `hidden`   | Лейаут прячет узел через `display: none`. Поле остаётся зарегистрированным и валидируется.                               |
| `disabled` | Инпут, кнопка добавления массива и Monaco недоступны. На детей не распространяется.                                      |
| `required` | Звёздочка у заголовка, прячет кнопку сброса. Объект и массив без `default` получают `{}` или `[]`. Проверку не включает. |
| `open`     | Начальное раскрытие Card, Accordeon, Alert. На ошибке после submit раскрывается.                                         |
| `copy`     | В обзоре у строки и числа появляется кнопка копирования.                                                                 |

`flags.required` и ключевое слово `required` — разные механизмы: первый про интерфейс и начальное значение, второй про проверку наличия ключа (см. [Нюансы](./limitations.md)).

## Аннотации, которые читает kit

| Ключ                                 | Как используется                                                                            |
| :----------------------------------- | :------------------------------------------------------------------------------------------ |
| `title`                              | Подпись. Пустой `title` — заголовка нет, имя свойства подписью не становится.               |
| `description`                        | Подсказка рядом с заголовком. HTML/MD через `dangerouslySetInnerHTML` или `RenderHTMLOrMD`. |
| `examples[0]`                        | Placeholder строковых инпутов.                                                              |
| `default`                            | Начальное значение при регистрации, пока родитель не пуст.                                  |
| `enum`                               | Пункты select, radio и групп чекбоксов. У массива — `items.enum`.                           |
| `minimum` / `maximum` / `multipleOf` | min, max и step у NumberInput.                                                              |
| `readOnly`                           | Узел не рисуется в режиме формы.                                                            |
| `writeOnly`                          | Узел не рисуется в режиме обзора.                                                           |

## Ключевые слова JSON Schema

Валидатор — `json-schema-library`, Draft-07. Собран с `formatAssertion: false`, поэтому `format` не проверяется.

| Тип              | Ключевые слова                                                                                                          |
| :--------------- | :---------------------------------------------------------------------------------------------------------------------- |
| Общие            | `type`, `enum`, `const`, `allOf`, `anyOf`, `oneOf`, `not`, `if` / `then` / `else`, `$ref`, `$id`, `definitions`         |
| object           | `properties`, `required`, `additionalProperties`, `patternProperties`, `dependencies`, `minProperties`, `maxProperties` |
| array            | `items`, `additionalItems`, `contains`, `minItems`, `maxItems`, `uniqueItems`                                           |
| number / integer | `minimum`, `maximum`, `exclusiveMinimum`, `exclusiveMaximum`, `multipleOf`                                              |
| string           | `minLength`, `maxLength`, `pattern`. `format` не проверяется.                                                           |
| кастом           | `stringNumber` — число, хранимое строкой. Сравнение через Decimal.                                                      |

### stringNumber

Число, которое хранится строкой. Поля `type`, `minimum`, `maximum`, `exclusiveMinimum`, `exclusiveMaximum`, `multipleOf` задаются строками, сравнение — через Decimal. Коды и тексты ошибок те же, что у чисел. Пустая строка при заданном `type` — ошибка типа.

```tsx
const schema: JsonSchema = {
  type: JsonSchemaType.Object,
  properties: {
    amount: {
      type: JsonSchemaType.String,
      title: 'Сумма',
      stringNumber: {type: 'number', minimum: '0', multipleOf: '0.01'},
      nodeParameters: {type: NodeType.String, entity: 'string_number_with_scale'},
    },
    kind: {
      type: JsonSchemaType.String,
      enum: ['one', 'two'],
      nodeParameters: {type: NodeType.String, entity: 'radio_group'},
    },
  },
  nodeParameters: {
    type: NodeType.Object,
    entityProps: {
      groups: [{title: 'Платёж', order: ['amount', 'kind'], layout: 'card'}],
    },
  },
};
```

## $ref

> **Соседи `$ref`.** Для отрисовки цель `$ref` сливается с узлом-ссылкой, цель побеждает. Валидатор Draft-07 соседние ключевые слова в том же объекте не учитывает (например, `minLength` рядом с `$ref` не проверяется). Подписи, `nodeParameters` и ограничения держите на целевой схеме.

`getSchemaByPointer` разрешает указатель, подмешивая цель `$ref` на каждом шаге, и защищён от циклических ссылок. Подписка на патчи учитывает цепочку `$ref` (см. [Рантайм](./runtime.md#события)).
