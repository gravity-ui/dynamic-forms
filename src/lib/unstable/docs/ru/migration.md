[← К оглавлению](./README.md)

# Мост со старым Spec

Как перейти со старого формата `Spec` (см. [docs/spec.md](../../../../../docs/spec.md)) на JSON Schema рендерера.

## specToJsonSchema

Конвертер переводит старое описание `Spec` в схему с `nodeParameters`. `DynamicField` с флагом `withSchemaRenderer` делает этот перевод и монтирует `SchemaRenderer` в режиме формы с kit-конфигом и `errorMessages`. Новой схеме с `nodeParameters` перевод не нужен.

| Spec                                    | JSON Schema                                                                                       |
| :-------------------------------------- | :------------------------------------------------------------------------------------------------ |
| `defaultValue`                          | `default`                                                                                         |
| `type`                                  | `type` + `nodeParameters.type`                                                                    |
| `required`                              | `required` родителя + `flags.required` (+ трюк `not` / `enum`)                                    |
| `format: 'int64'`                       | `type: integer`                                                                                   |
| `validator` (функция)                   | `nodeParameters.validator`                                                                        |
| `viewSpec.type`                         | `nodeParameters.entity`                                                                           |
| `viewSpec.layout`                       | `nodeParameters.layout` (`row_verbose` → `row` + описание; `section` / `section2` → подзаголовки) |
| `viewSpec.layoutOpen`, disabled, hidden | `flags.open`, `flags.disabled`, `flags.hidden`                                                    |

## viewSpec.type → entity

| `viewSpec.type`               | Сущность                                                                      |
| :---------------------------- | :---------------------------------------------------------------------------- |
| `oneof`                       | checkbox / switch (boolean), `radio_group`, select или segmented — по виджету |
| `multi_oneof`                 | Массив переключателей, например группа чекбоксов                              |
| `object_value`                | `dot_value`                                                                   |
| `date_input`                  | `date`                                                                        |
| `file_input` / `monaco_input` | `file_input` / `monaco_input`                                                 |
| `number_with_scale`           | `number_with_scale` или `string_number_with_scale`                            |
| `range_input_picker`          | `range_input`                                                                 |
| иначе                         | `entity = viewSpec.type`                                                      |

## Что не переносится

> Конвертер пишет, но kit не читает `itemPrefix`, `link`, `addButtonPosition`. В режиме `withSchemaRenderer` не используются `validators`, `mutators`, `search`, `generateRandomValue` из `DynamicFormConfig` — валидаторы при миграции переносите в `config` (см. [Расширение](./extension.md#свой-валидатор)).

Строковый `spec.validator` после конвертации становится ключом, которого нет в пустых `validators` kit, — проверка молча пропускается. Подробнее об этом и других краевых случаях — в [Нюансах](./limitations.md).
