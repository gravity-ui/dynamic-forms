[← К оглавлению](./README.md)

# Справочник API

Весь публичный API доступен из `@gravity-ui/dynamic-forms/unstable` (реэкспорт `core` и `kit`).

## Компоненты и хуки core

| Экспорт                                                              | Роль                                                                                                            |
| :------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------- |
| `SchemaRenderer`                                                     | Компонент. Вызывает `useSchemaRenderer` и рисует корневой узел с `schemaPath="#"`.                              |
| `useSchemaRenderer`                                                  | Хук. Поднимает состояние в служебном поле, вешает валидатор, оборачивает `form.submit`. Возвращает `validate`.  |
| `SchemaRendererNode`                                                 | Один узел дерева. Составные сущности рисуют детей им.                                                           |
| `useSchemaRendererState`                                             | Читает `SchemaRendererState` служебного поля, перерисовка по выбранным событиям.                                |
| `useSchemaRendererTools`                                             | Императив: патчи схемы, внешние ошибки, userContext. Внутри той же `Form`.                                      |
| `useSchemaRendererNodeContext`                                       | Контекст ближайшего узла: `input`, `meta`, `schema`, `schemaPath`, `name`, `headName`, `mode`, `settings`.      |
| `SchemaRendererNodeContext` / `createSchemaRendererNodeContextRuler` | Стор-контекст узла. Нужен сущностям, которые рисуются без `SchemaRendererNode` (переключатель `one_of_nested`). |
| `getRenderKit`                                                       | По конфигу и схеме собирает `Entity`, `Layout` и их props для формы и обзора.                                   |

## Пропсы SchemaRenderer и useSchemaRenderer

Держите `config`, `errorMessages` и `userContext` стабильными ссылками: смена ссылки шлёт событие подписчикам, а новая `schema` сбрасывает рабочую копию целиком.

| Проп                  | Обяз. | Поведение                                                                                                     |
| :-------------------- | :---: | :------------------------------------------------------------------------------------------------------------ |
| `name`                |  да   | Путь корня в final-form. Пустая строка привязывает рендерер ко всему `values`.                                |
| `schema`              |  да   | Корневая JSON Schema. Новая ссылка сбрасывает копию, патчи, ошибки, кэш и `submitCount`.                      |
| `mode`                |  да   | `form` или `overview`. Выбирает пару entity и layout.                                                         |
| `validateOnBlur`      |  да   | Должен совпадать с `<Form validateOnBlur>`. `runValidate` опирается на него, когда блюрит служебное поле.     |
| `config`              |  нет  | Реестр компонентов. Без него строковые ключи `entity` и `layout` не находятся.                                |
| `errorMessages`       |  нет  | Тексты ошибок JSON Schema на всё дерево.                                                                      |
| `userContext`         |  нет  | Общий объект дерева. Встроенные ключи: `MonacoEditor`, `RenderHTMLOrMD`.                                      |
| `size`                |  нет  | `s`, `m`, `l`, `xl`. По умолчанию `m`. Из размера считаются варианты заголовков.                              |
| `view`                |  нет  | `stretch` или `fit`. По умолчанию `stretch`. Ширина контейнеров kit.                                          |
| `coerceInitialValues` |  нет  | По умолчанию `true`. Приводит уже лежащее значение к `schema.type`.                                           |
| `jsonDefaultValues`   |  нет  | По умолчанию `false`. Перед подстановкой делает `JSON.parse` у `default`.                                     |
| `connectValidate`     |  нет  | Только у хука. По умолчанию `true` — валидатор на служебном поле. `false` отдаёт `validate` вызывающему коду. |

## useSchemaRendererTools

| Метод                  | Аргумент                                      | Эффект                                                                                                        |
| :--------------------- | :-------------------------------------------- | :------------------------------------------------------------------------------------------------------------ |
| `addExternalErrors`    | `{headName, regularErrors?, priorityErrors?}` | Доливает внешние ошибки и перезапускает проверку. `regular` — низкий приоритет, `priority` перекрывает схему. |
| `removeExternalErrors` | `{headName, removeFunctionOrNames}`           | Удаляет по списку имён или функции над обоими словарями, затем перезапуск.                                    |
| `addSchemaPatches`     | `{patches}`                                   | Патчит рабочую схему, шлёт `Patch`, перезапускает проверку.                                                   |
| `removeSchemaPatches`  | `{patchesToRemove}`                           | Снимает патчи, восстанавливает листья из оригинала, перезапуск.                                               |
| `updateUserContext`    | `{headName, userContext, replace?}`           | Мержит (или с `replace` заменяет) userContext и шлёт `UserContext`.                                           |

## Константы и перечисления

| Экспорт                         | Значения                                                                                                    |
| :------------------------------ | :---------------------------------------------------------------------------------------------------------- |
| `NodeType`                      | `any`, `array`, `boolean`, `number`, `object`, `string` — ветки конфига.                                    |
| `JsonSchemaType`                | `array`, `boolean`, `integer`, `null`, `number`, `object`, `string` — значение `schema.type`.               |
| `SchemaRendererMode`            | `form`, `overview`.                                                                                         |
| `SchemaRendererEventType`       | `Config`, `Error`, `ErrorMessages`, `Mode`, `Name`, `Patch`, `Settings`, `Schema`, `Submit`, `UserContext`. |
| `SCHEMA_RENDERER_SERVICE_FIELD` | Префикс имени служебного поля: `SCHEMA_RENDERER_SERVICE_FIELD.<name>`.                                      |

## Утилиты и definers

| Экспорт                                             | Что делает                                                                            |
| :-------------------------------------------------- | :------------------------------------------------------------------------------------ |
| `getServiceFieldName`                               | Имя служебного поля по `name`.                                                        |
| `getParentName`                                     | Родительский путь. `getParentName('a.b')` → `'a'`, `getParentName('profile')` → `''`. |
| `getSchemaByPointer`                                | Схема по JSON Pointer с подмешиванием `$ref` на каждом шаге и защитой от циклов.      |
| `isStringNumber` / `isStringInt` / `isStringFloat`  | Проверка числовой строки для `stringNumber`.                                          |
| `defineNodeEntityConfig` / `defineNodeLayoutConfig` | Типобезопасная запись сущности и лейаута в конфиг: `Component` и `defaultProps`.      |
| `createNodeParametersDefiner`                       | По конфигу возвращает `defineNodeParameters` с подсказками ключей и props.            |

## Экспорты kit

Почти каждый компонент экспортирует свой тип props. Исключения — `Transparent`, `EntityError`, `EmptyEntityValue`, `OverviewRow`, `OverviewColumn`.

| Группа                | Экспорты                                                                                                                                                                                                                                                                                                              |
| :-------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| constants (5)         | `config`, `untypedConfig`, `errorMessages`, `DASH`, `DEFAULT_DATE_FORMAT`                                                                                                                                                                                                                                             |
| entities (11)         | Alert, ArrayEntity, ArrayTable, DotValue, FewOfNested, Label, Monaco, ObjectEntity, ObjectInline, OneOfNested, TextContent                                                                                                                                                                                            |
| form-entities (19)    | StringInput, TextAreaInput, PasswordInput, NumberInput, SelectInput, MultiSelectInput, RadioGroupInput, SegmentedRadioGroupInput, CheckboxInput, CheckboxGroupInput, SwitchInput, ColorPickerInput, DateInput, FileInput, SliderInput, RangeInput, RangeSliderInput, NumberWithScaleInput, StringNumberWithScaleInput |
| overview-entities (9) | StringValue, NumberValue, BooleanValue, DateValue, ColorPickerValue, PrimitiveArrayValue, RangeValue, NumberWithScaleValue, StringNumberWithScaleValue                                                                                                                                                                |
| layouts (4)           | Accordeon, Card, Section, Transparent                                                                                                                                                                                                                                                                                 |
| form-layouts (2)      | FormRow, FormColumn                                                                                                                                                                                                                                                                                                   |
| overview-layouts (2)  | OverviewRow, OverviewColumn                                                                                                                                                                                                                                                                                           |
| components (13)       | ArrayRemoveButton, CopyButton, DropButton, EmptyEntityValue, EntityContainer, EntityDescription, EntityError, EntityTitle, HTMLContent, LayoutContainer, LayoutButtons, LongValue, MonacoContainer                                                                                                                    |
| hooks (1)             | useExpanded                                                                                                                                                                                                                                                                                                           |
| utils (7)             | getValidationState, getBooleanValidationState, isArrayItem, isTupleItem, getArrayItemIndex, getArrayItemParentName, specToJsonSchema                                                                                                                                                                                  |

Что умеют компоненты `kit` и их props — в разделе [Kit](./kit.md).

## Типы

Все типы из `core/types` реэкспортируются через `export type *`, включая `JSLErrors` (только как тип).

| Группа     | Типы                                                                                                                                          |
| :--------- | :-------------------------------------------------------------------------------------------------------------------------------------------- |
| Схема      | `JsonSchema` и варианты: `JsonSchemaObject`, `JsonSchemaArray`, `JsonSchemaString`, `JsonSchemaNumber`, `JsonSchemaBoolean`, `JsonSchemaAny`. |
| Конфиг     | `NodesConfig`, `NodeTypeConfig`, `NodeEntitiesConfig`, `NodeLayoutsConfig`.                                                                   |
| Компоненты | `NodeEntity`, `NodeEntityProps`, `NodeLayout`, `NodeLayoutProps`.                                                                             |
| Валидация  | `Validator`, `ValidationError`, `ErrorMessages`, `JSLErrors`.                                                                                 |
| Значения   | `SchemaToValueType` и производные типы значений.                                                                                              |
| Состояние  | `SchemaRendererState`, `SchemaRendererSettings`, `SchemaPatch`, `SchemaPatchRemover`, `UseSchemaRendererParams`.                              |
