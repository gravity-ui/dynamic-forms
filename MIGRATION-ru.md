# Переход на стабильный SchemaRenderer

[English](MIGRATION.md) · **Русский**

[← К документации](README-ru.md#оглавление)

Корень пакета теперь экспортирует SchemaRenderer, который раньше был доступен через `@gravity-ui/dynamic-forms/unstable`. Прежний API DynamicField / DynamicView переезжает в `@gravity-ui/dynamic-forms/deprecated`. Точка входа `/unstable` удалена.

Для приложения на прежнем основном API миграция включает замену рендерера, формата схем, конфигов и API своих компонентов. Перенос импорта в `/deprecated` позволяет сохранить работу старой формы на время перехода, но сам по себе не переводит её на SchemaRenderer.

## Выбор сценария

| Что используется сейчас                                                              | Как мигрировать                                                                                                |
| ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| `DynamicField`, `DynamicView`, `Spec`, старые конфиги или компоненты из корня пакета | Следуйте разделу [Старый основной API → новый основной API](#старый-основной-api--новый-основной-api).         |
| SchemaRenderer и его расширения из `/unstable`                                       | Следуйте разделу [Unstable → основной API](#unstable--основной-api).                                           |
| Оба API одновременно                                                                 | Мигрируйте каждое использование с учётом его API. На время перехода оба API могут работать в одном приложении. |
| Старая форма, которую пока нельзя мигрировать                                        | Временно используйте [точку входа deprecated](#сохранение-старой-формы-на-время-миграции).                     |

## Зависимости и импорты

Обе публичные точки входа требуют **UIKit 8**. `/deprecated` сохраняет старый API dynamic-forms, но не обеспечивает совместимость с UIKit 7. Изменения для приложения описаны в [руководстве по миграции UIKit](https://github.com/gravity-ui/uikit/blob/main/docs/migration-to-v8-ru.md). Актуальные диапазоны peer-зависимостей указаны в [package.json](package.json).

В приложении могут одновременно использоваться старый API из корня пакета и SchemaRenderer из `/unstable`, в том числе прямые импорты компонентов и типов вне обёрток над формами. Перед заменой импортов разделите эти случаи:

```shell
rg -n '@gravity-ui/dynamic-forms' --glob '!**/node_modules/**' --glob '!**/*lock*'
```

Некоторые экспорты сохранили имена, но имеют другой контракт в новом основном API; см. [Прямые импорты компонентов, типов и хелперов](#прямые-импорты-компонентов-типов-и-хелперов).

## Старый основной API → новый основной API

### 1. Замена DynamicField и определения Spec

До миграции, на предыдущей версии пакета:

```tsx
import React from 'react';
import {Form} from 'react-final-form';
import {DynamicField, SpecTypes, dynamicConfig, type Spec} from '@gravity-ui/dynamic-forms';

const spec: Spec = {
  type: SpecTypes.Object,
  viewSpec: {type: 'base'},
  properties: {
    login: {
      type: SpecTypes.String,
      required: true,
      viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Login'},
    },
  },
};

export function ProfileForm() {
  return (
    <Form initialValues={{login: 'alice'}} onSubmit={(values) => console.log(values)}>
      {({handleSubmit}) => (
        <form onSubmit={handleSubmit}>
          <DynamicField name="" spec={spec} config={dynamicConfig} />
          <button type="submit">Save</button>
        </form>
      )}
    </Form>
  );
}
```

После миграции, на новом основном API:

```tsx
import React from 'react';
import {Form} from 'react-final-form';
import {
  JsonSchemaType,
  NodeType,
  SchemaRenderer,
  SchemaRendererMode,
  config,
  errorMessages,
  type JsonSchema,
} from '@gravity-ui/dynamic-forms';

const schema: JsonSchema = {
  type: JsonSchemaType.Object,
  nodeParameters: {type: NodeType.Object, entity: 'base'},
  required: ['login'],
  properties: {
    login: {
      type: JsonSchemaType.String,
      title: 'Login',
      minLength: 1,
      nodeParameters: {
        type: NodeType.String,
        entity: 'base',
        layout: 'row',
        flags: {required: true},
      },
    },
  },
};

export function ProfileForm() {
  return (
    <Form
      initialValues={{login: 'alice'}}
      onSubmit={(values) => console.log(values)}
      validateOnBlur={false}
    >
      {({handleSubmit}) => (
        <form onSubmit={handleSubmit}>
          <SchemaRenderer
            name=""
            schema={schema}
            mode={SchemaRendererMode.Form}
            config={config}
            errorMessages={errorMessages}
            validateOnBlur={false}
          />
          <button type="submit">Save</button>
        </form>
      )}
    </Form>
  );
}
```

Структура отправляемых значений остаётся прежней: `{login: string}`. `name=""` связывает рендерер со всем объектом значений формы, а `name="profile"` — с `values.profile`. При миграции части большой формы сохраните исходный путь поля.

Форма должна оставаться внутри UIKit `ThemeProvider` приложения. SchemaRenderer использует `Form` из `react-final-form`; его узлы сами регистрируют поля, поэтому дополнительная обёртка `Field` не нужна. Передавайте одинаковое значение `validateOnBlur` в `Form` и SchemaRenderer. Если в форме есть свои компоненты, вместо встроенного `config` передайте мигрированный конфиг приложения.

### 2. Перенос полей Spec в JSON Schema и nodeParameters

JSON Schema описывает значение и правила валидации. `nodeParameters` задаёт отображение узла. **Entity** — компонент ввода или отображения значения. **Layout** — его обрамление: заголовок, описание, ошибка и отступы.

Вложенные `properties` и `items` тоже нужно мигрировать рекурсивно: их дочерние элементы должны стать узлами JSON Schema, а не остаться объектами Spec.

| Старый Spec / viewSpec                                         | Новая схема                                                                                                                                                                                                       |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type: SpecTypes.String`                                       | `type: JsonSchemaType.String` для типа значения; `nodeParameters.type: NodeType.String` для поиска компонентов в конфиге.                                                                                         |
| `properties`, `items`, `enum`, `minimum`, `maximum`, `pattern` | Соответствующие поля JSON Schema; проверьте типы значений, которые принимает новая схема.                                                                                                                         |
| `defaultValue`                                                 | `default`.                                                                                                                                                                                                        |
| `format: 'int64'`                                              | `type: integer`.                                                                                                                                                                                                  |
| `required: true` у дочернего поля                              | `required: ['childName']` у родителя и подходящие ограничения на пустое значение у дочернего поля.                                                                                                                |
| `viewSpec.type`                                                | `nodeParameters.entity` либо отдельные `formEntity` и `overviewEntity`. Некоторые встроенные ключи меняются; см. [таблицу преобразований](#viewspectype--entity).                                                 |
| `viewSpec.inputProps`                                          | `nodeParameters.entityProps` либо `formEntityProps` / `overviewEntityProps` для конкретного режима; пропсы самого компонента тоже нужно адаптировать.                                                             |
| `viewSpec.layout`, `viewSpec.layoutProps`                      | `nodeParameters.layout`, `nodeParameters.layoutProps` либо настройки layout для конкретного режима. Конвертер заменяет `row_verbose` на `row` с описанием, а `section` / `section2` — на секции с подзаголовками. |
| `viewSpec.layoutTitle`, `viewSpec.layoutDescription`           | `title`, `description`.                                                                                                                                                                                           |
| `viewSpec.disabled`, `viewSpec.hidden`, `viewSpec.layoutOpen`  | `nodeParameters.flags.disabled`, `.hidden`, `.open`.                                                                                                                                                              |
| `viewSpec.placeholder`                                         | Для текстового поля — `nodeParameters.entityProps.placeholder`. У других entity свои пропсы.                                                                                                                      |
| `spec.validator`                                               | `nodeParameters.validator` и соответствующий мигрированный валидатор в новом конфиге.                                                                                                                             |

`required` в JSON Schema проверяет наличие свойства, но не запрещает `''` или пустой массив. В примере пустой логин запрещает `minLength: 1`. Для непустого массива используйте `minItems: 1`. `flags.required` управляет поведением и отображением обязательного поля в рендерере, но не является правилом валидации. Отдельно проверьте смысл обязательности булевых полей: требование наличия свойства и требование значения `true` — разные ограничения.

Конвертер `specToJsonSchema` при переносе `required` также выставляет `flags.required` и добавляет ограничение через `not` / `enum`, запрещающее `null`, `undefined`, пустую строку и `false`.

Не заменяйте `flags.disabled` на `readOnly: true`: в режиме Form узлы с `readOnly` скрываются. Аналогично, `writeOnly: true` скрывает узел в режиме Overview. Скрытый узел по-прежнему может участвовать в валидации схемы.

По умолчанию у SchemaRenderer установлено `coerceInitialValues={true}`: начальные значения могут приводиться к типам схемы. Установите `false`, если приложение должно сохранить исходные типы. Если значения по умолчанию представлены строками с JSON, проверьте `jsonDefaultValues` и существующий разбор в обёртке: разбирать их нужно один раз, а не одновременно до рендеринга и внутри рендерера.

Поддерживаемые ключевые слова и особенности поведения, которые нужно сопоставить с существующими формами, описаны в разделах [Схема](docs/ru/schema.md) и [Нюансы и ограничения](docs/ru/limitations.md).

### 3. Использование старого Spec с новым рендерером

Существующее описание в формате `Spec` можно использовать со SchemaRenderer, не переписывая его сразу. Преобразуйте его через `specToJsonSchema` и передайте результат в проп `schema`. Источник Spec не имеет значения: это может быть объект в коде приложения, конфигурационный файл или данные извне. Например, внутри обёртки, которая получает `spec`:

```tsx
import React from 'react';
import {specToJsonSchema, errorMessages} from '@gravity-ui/dynamic-forms';
import type {Spec} from '@gravity-ui/dynamic-forms/deprecated';

export function useConvertedSchema(spec: Spec) {
  return React.useMemo(() => specToJsonSchema(spec, undefined, undefined, errorMessages), [spec]);
}
```

Используйте полученную схему в примере формы выше. Единственный импорт из старого API в этом адаптере — тип: отображение уже работает через новый основной API. Когда описание будет переведено на JSON Schema, удалите конвертер и старый тип `Spec`. Если существующая обёртка сначала подготавливает Spec, например разбирает значения по умолчанию, осознанно сохраните или замените эту подготовку и проверьте полученные значения.

#### viewSpec.type → entity

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

#### Что не переносится

Конвертер переносит поля схемы, но **не мигрирует** ваши компоненты, конфиги и валидаторы. Ключ своего entity должен присутствовать в новом конфиге. Строковому ключу валидатора должен соответствовать валидатор в этом конфиге; во встроенном конфиге своих валидаторов нет. Если строковый ключ валидатора не зарегистрирован, проверка молча пропускается.

Старый переключатель `DynamicField withSchemaRenderer` не заменяет полноценную миграцию: он использует встроенный конфиг SchemaRenderer, а не переданный старый `DynamicFormConfig`, и не переносит старые интеграции поиска, мутаторов и другие механизмы приложения. Используйте SchemaRenderer явно с мигрированным конфигом.

Конвертер записывает `itemPrefix`, `link` и `addButtonPosition`, но новый kit эти параметры не читает. Подробнее об этом и других ограничениях — в разделе [Нюансы и ограничения](docs/ru/limitations.md).

### 4. Замена DynamicView режимом Overview

Раньше компонент просмотра получал значение напрямую:

```tsx
<DynamicView value={values} spec={spec} config={dynamicViewConfig} />
```

У SchemaRenderer нет пропа `value`. Поместите значения в `Form` и выберите режим Overview. Ниже используются `schema` и импорты из примера новой формы:

```tsx
export function ProfileOverview({values}: {values: {login: string}}) {
  return (
    <Form initialValues={values} onSubmit={() => undefined}>
      {() => (
        <SchemaRenderer
          name=""
          schema={schema}
          mode={SchemaRendererMode.Overview}
          config={config}
          errorMessages={errorMessages}
          validateOnBlur={false}
        />
      )}
    </Form>
  );
}
```

Новый конфиг содержит компоненты и для редактирования, и для просмотра. Старый `dynamicViewConfig` нельзя передать вместо него без изменений. Регистрируйте свои компоненты отображения значений в `overviewEntities`, а layout — в `overviewLayouts`. Проверьте пустые значения, ссылки, форматирование и чувствительные данные не только в редактируемой форме, но и в режиме Overview.

### 5. Миграция своих компонентов, конфигов и валидаторов

| Прежний API                                                               | SchemaRenderer                                          |
| ------------------------------------------------------------------------- | ------------------------------------------------------- |
| `dynamicConfig[type].inputs`                                              | `config[type].formEntities`                             |
| `dynamicConfig[type].layouts`                                             | `config[type].formLayouts`                              |
| `dynamicViewConfig[type].views`                                           | `config[type].overviewEntities`                         |
| `dynamicViewConfig[type].layouts`                                         | `config[type].overviewLayouts`                          |
| Старые типы компонентов ввода, например `StringInput`                     | `NodeEntity<JsonSchemaString, YourProps>`               |
| Старые типы layout-компонентов                                            | `NodeLayout<SchemaType, YourProps>`                     |
| `spec`, `inputProps`, отдельный `name` в пропсах старого компонента ввода | `schema`, `props`, `input.name` в пропсах нового entity |
| Старый валидатор `(spec, value)`                                          | Новый валидатор `(value, allValues)`                    |

Взаимодействие с полем остаётся через `input.value`, `input.onChange`, `input.onBlur` и `input.onFocus`. Адаптируйте чтение параметров схемы, состояния disabled, валидации и размера. Одного переименования TypeScript-типа недостаточно.

Новый `input` следует контракту final-form: в `onChange` нужно передавать новое значение, а не прежнюю функцию обновления или второй аргумент `childErrors`. Старые хелперы `arrayInput`, `onDrop` и `parentOnUnmount` не передаются. Своим компонентам массивов нужно адаптировать обновление значений и отображение дочерних элементов под новый API узлов.

Например, этот компонент ввода и валидатор готовы для нового конфига:

```tsx
import React from 'react';
import {TextInput} from '@gravity-ui/uikit';
import {
  JsonSchemaType,
  NodeType,
  config,
  getValidationState,
  type JsonSchemaString,
  type NodeEntity,
  type NodesConfig,
  type Validator,
} from '@gravity-ui/dynamic-forms';

const LoginInput: NodeEntity<JsonSchemaString, {placeholder?: string}> = ({
  input,
  meta,
  props,
  schema,
  settings,
}) => (
  <TextInput
    value={input.value ?? ''}
    onUpdate={input.onChange}
    onBlur={input.onBlur}
    onFocus={input.onFocus}
    placeholder={props.placeholder}
    disabled={schema.nodeParameters?.flags?.disabled}
    size={settings?.size}
    validationState={getValidationState(meta)}
  />
);

const allowedLogin: Validator<JsonSchemaString> = (value) =>
  value === 'admin' ? 'This login is reserved' : undefined;

export const appConfig: NodesConfig = {
  ...config,
  [NodeType.String]: {
    ...config[NodeType.String],
    formEntities: {
      ...config[NodeType.String]?.formEntities,
      login: {Component: LoginInput},
    },
    validators: {
      ...config[NodeType.String]?.validators,
      allowedLogin,
    },
  },
};
```

Передайте `config={appConfig}` в SchemaRenderer и используйте это определение для `schema.properties.login`:

```tsx
export const loginSchema: JsonSchemaString = {
  type: JsonSchemaType.String,
  title: 'Login',
  minLength: 1,
  nodeParameters: {
    type: NodeType.String,
    formEntity: 'login',
    formEntityProps: {placeholder: 'Enter a login'},
    overviewEntity: 'base',
    layout: 'row',
    flags: {required: true},
    validator: 'allowedLogin',
  },
};
```

Здесь в Form используется свой компонент ввода, а в Overview — встроенный компонент отображения строки. Если задать только `entity: 'login'`, этот ключ будет искаться в обоих режимах, поэтому потребуется регистрация и для Overview. При выборе `formEntity` или `overviewEntity` пропсы соответствующего режима заменяют общие `entityProps`, а не объединяются с ними.

При расширении конфига сохраняйте встроенные регистрации, как в примере выше. Свой layout должен отображать дочерние элементы и, если нужны тексты ошибок валидации, новый компонент `EntityError`. Entity с флагом `independent` самостоятельно использует переданный ему layout. Примеры layout и хелперов для типизированного конфига есть в разделе [Расширение](docs/ru/extension.md).

Валидатор должен возвращать строку с ошибкой или `undefined` при успехе; асинхронный валидатор возвращает promise с тем же результатом. Обрабатывайте ошибки запросов внутри валидатора. Если старый валидатор читает `spec`, перенесите эти ограничения в JSON Schema либо явно адаптируйте валидатор, передав нужные параметры: теперь первый аргумент — значение, а не Spec.

### 6. Миграция интеграций приложения

| Старая интеграция                                                                         | Что делать со SchemaRenderer                                                                                                                         |
| ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shared` и старые хуки общего хранилища                                                   | Передавайте `userContext`; читайте его через `useSchemaRendererState` внутри формы. Адаптируйте потребителей старого хранилища.                      |
| Проп `Monaco`                                                                             | Передавайте компонент редактора приложения через `userContext.MonacoEditor`. Сохраните загрузку редактора и настройку его workers в приложении.      |
| Свой рендеринг HTML / Markdown                                                            | Передавайте `userContext.RenderHTMLOrMD`; см. [Справочник API](docs/ru/api.md).                                                                      |
| Проп `Link` у `DynamicView` или свои компоненты просмотра                                 | Реализуйте и зарегистрируйте overview entity с нужным поведением ссылок приложения.                                                                  |
| `mutators`, `search`, `generateRandomValue`, `storeSubscriber`, `__mirror` у DynamicField | Прямой замены пропов нет. Переносите соответствующее поведение в свои entity, обновления значений final-form, патчи схемы или подписки на состояние. |
| Ошибки сервера после отправки формы                                                       | Передавайте ошибки полей через `useSchemaRendererTools().addExternalErrors`; см. [Внешние ошибки](docs/ru/extension.md#внешние-ошибки-после-submit). |
| Разделение формы на независимо отображаемые поля или шаги                                 | Используйте `useSchemaRenderer` вместе со `SchemaRendererNode`; см. [Автономный рендерер](docs/ru/extension.md#автономный-рендерер).                 |

Новый kit отображает ошибки из состояния SchemaRenderer. Возврата `submitErrors` в final-form недостаточно, чтобы гарантировать прежнее отображение сообщений. Внешние ошибки используют полные пути полей; при необходимости их нужно явно очищать.

Сохраняйте стабильную ссылку на объект схемы между рендерами, например через `useMemo` при конвертации. Новая ссылка на схему сбрасывает рабочую схему рендерера, патчи и ошибки. Ссылки на конфиг и пользовательский контекст тоже должны оставаться стабильными, пока их содержимое не меняется.

### Прямые импорты компонентов, типов и хелперов

Эти изменения касаются и прямых импортов вне обёртки приложения над формами:

- **`Spec`, `ObjectSpec`, `StringSpec` и другие** остаются типами старого формата схем. Заменяйте их на `JsonSchema`, `JsonSchemaObject`, `JsonSchemaString` и другие только после миграции самих описаний схем. Пока используется конвертер, описания в старом формате должны сохранять тип `Spec` из `/deprecated`.
- **`SpecTypes`** заменяется на `JsonSchemaType` для типов значений и `NodeType` для выбора компонентов из конфига. Это разные назначения, а не одно глобальное переименование.
- **`DynamicFormConfig` / `DynamicViewConfig`** заменяются на `NodesConfig` с регистрациями, описанными выше. Старые конфиги с ним невзаимозаменяемы.
- **`StringInput` и другие имена компонентов ввода / layout** могут по-прежнему присутствовать в корне пакета, но относиться к новым компонентам с контрактами `NodeEntity` / `NodeLayout`. Например, старый тип `StringInput` описывает свой компонент ввода, а новый экспорт `StringInput` из корня — готовый компонент kit. Механическая замена импортов или приведение типов здесь не подходит.
- **Старые компоненты просмотра и хелперы**, например `BaseView`, `ViewController`, `ErrorWrapper`, `isArraySpec` или старые хуки контекста, не являются общими утилитами нового рендерера. Переведите их использование на новые API узлов, layout и состояния либо временно оставьте соответствующий компонент на `/deprecated`. Новые компоненты, использующие контекст узла, должны отображаться внутри этого контекста рендерера.
- **`ErrorMessages`** в новом корне — тип сообщений об ошибках JSON Schema. Готовый словарь сообщений экспортируется как `errorMessages` с маленькой буквы; у него нет прежнего контракта runtime-экспорта `ErrorMessages`.
- **Типы значений**, например `FieldValue` или `FormValue`, нужно рассматривать вместе с их использованием. На границах API используйте фактический тип отправляемых значений приложения: смена типа схемы не преобразует значения автоматически.
- **`configure` и `Lang`** по-прежнему работают из корня пакета; точка входа `/deprecated` использует ту же конфигурацию языка.

### Проверка мигрированной формы

Для каждой мигрированной формы и режима просмотра проверьте начальные значения и значения по умолчанию, отправляемые данные, сброс формы, обязательные поля и свои валидаторы, внешние ошибки, условные поля, массивы, свои компоненты ввода и форматирование значений. Сохраните проверки поведения, специфичного для приложения, а не только успешной отрисовки.

После перевода последнего потребителя на SchemaRenderer и JSON Schema удалите неиспользуемые старые конфиги, адаптеры и импорты из `/deprecated`. Перед удалением legacy-зависимостей проверьте, не нужны ли они другим пакетам приложения.

## Unstable → основной API

Для кода, который уже использует SchemaRenderer, перенос в стабильную часть меняет публичный путь импорта, но не API рендерера:

```diff
-import {SchemaRenderer, config} from '@gravity-ui/dynamic-forms/unstable';
-import type {JsonSchema, NodesConfig} from '@gravity-ui/dynamic-forms/unstable';
+import {SchemaRenderer, config} from '@gravity-ui/dynamic-forms';
+import type {JsonSchema, NodesConfig} from '@gravity-ui/dynamic-forms';
```

Обновите обёртки, свои entity, хуки, импорты типов, реэкспорты и алиасы. При этом переносе существующие определения JSON Schema, регистрации `NodesConfig` и пропсы рендерера сохраняют свои контракты. При обновлении с более старой версии пакета также учитывайте промежуточные изменения, включая требование UIKit 8.

Если то же приложение использует старый API из корня пакета, мигрируйте эти места отдельно по разделу перехода со старого API на новый. Одной замены пути импорта для обоих случаев недостаточно.

## Сохранение старой формы на время миграции

Используйте `/deprecated` для кода, которому пока нужен старый API. Эта точка входа сохраняет старый рендерер, Spec и контракты компонентов на время поэтапного перехода форм:

```diff
-import {DynamicField, DynamicView, dynamicConfig, dynamicViewConfig} from '@gravity-ui/dynamic-forms';
-import type {Spec, DynamicFormConfig} from '@gravity-ui/dynamic-forms';
+import {DynamicField, DynamicView, dynamicConfig, dynamicViewConfig} from '@gravity-ui/dynamic-forms/deprecated';
+import type {Spec, DynamicFormConfig} from '@gravity-ui/dynamic-forms/deprecated';
```

Прямые импорты старых компонентов тоже нужно обновить. Для этого варианта совместимости существующие определения Spec переписывать не требуется. Документация старого API находится в [docs/deprecated](docs/deprecated) и [Deprecated / Readme в Storybook](https://preview.gravity-ui.com/dynamic-forms/?path=/docs/deprecated-readme--docs).

Старый kit использует legacy-компоненты UIKit. Перечисленные ниже пакеты объявлены как необязательные peer-зависимости dynamic-forms, поэтому приложение, использующее этот kit, должно установить их:

```shell
npm install @hello-pangea/dnd@^18.0.1 react-window@^1.8.11 react-virtualized-auto-sizer@^1.0.26
```

Для работы SchemaRenderer эти три пакета не нужны. Оба варианта по-прежнему требуют UIKit 8.

## Репозиторий, Storybook и тесты

- `src/lib/unstable/core` и `src/lib/unstable/kit` переезжают в `src/lib/core` и `src/lib/kit`. Старые реализации переносятся в `src/lib/deprecated`.
- Истории SchemaRenderer переезжают на верхний уровень Storybook. Прежние истории и документация Storybook находятся в разделе `Deprecated`, внизу боковой панели.
- Основные руководства находятся в корневых [README](README-ru.md) и [MIGRATION](MIGRATION-ru.md), также доступны их английские версии. Подробные справочные разделы — в `docs/en` и `docs/ru`; старая документация — в [docs/deprecated](docs/deprecated).
- Тесты компонентов и скриншоты переезжают вместе с компонентами. Команда по умолчанию и CI запускают оба набора тестов; каждый набор можно запустить отдельно:

```shell
npm run playwright             # Все компонентные тесты
npm run playwright:schema      # SchemaRenderer
npm run playwright:deprecated  # Прежний API
```

Подготовка окружения описана в [руководстве по Playwright](playwright/README.md).
