# @gravity-ui/dynamic-forms &middot; [![npm package](https://img.shields.io/npm/v/@gravity-ui/dynamic-forms)](https://www.npmjs.com/package/@gravity-ui/dynamic-forms) [![CI](https://img.shields.io/github/actions/workflow/status/gravity-ui/dynamic-forms/.github/workflows/ci.yml?label=CI&logo=github)](https://github.com/gravity-ui/dynamic-forms/actions/workflows/ci.yml?query=branch:main) [![storybook](https://img.shields.io/badge/Storybook-deployed-ff4685)](https://preview.gravity-ui.com/dynamic-forms/)

[English](README.md) · **Русский**

Рендерер форм поверх JSON Schema и `react-final-form`. Одна схема описывает и значение, и его отрисовку: правила проверки — стандартные ключевые слова Draft-07, а чем рисовать узел — расширение `nodeParameters`.

- Точка входа: `@gravity-ui/dynamic-forms`.
- Статус: **стабильный API**.
- Два слоя: `core` (безголовый движок) и `kit` (готовые сущности и лейауты на `@gravity-ui/uikit`).

Прежний API DynamicField / DynamicView доступен через `@gravity-ui/dynamic-forms/deprecated`. Импорты SchemaRenderer из удалённой точки входа `/unstable` нужно заменить на импорты из корня пакета. Полный переход описан в [руководстве по миграции](MIGRATION-ru.md); документация прежнего API находится в [docs/deprecated](docs/deprecated).

## Установка

```shell
npm install --save-dev @gravity-ui/dynamic-forms
```

## Оглавление

- [Как использовать](docs/ru/how-to-use.md) — быстрый старт, проп `name`, режимы, что брать.
- [Справочник API](docs/ru/api.md) — компоненты, хуки, пропсы, константы, утилиты, экспорты `kit`, типы.
- [Схема](docs/ru/schema.md) — `nodeParameters`, флаги, аннотации, ключевые слова, `stringNumber`, `$ref`.
- [Рантайм](docs/ru/runtime.md) — жизнь узла, приведение значений, валидация, ошибки, события, патчи.
- [Kit](docs/ru/kit.md) — лейауты, каталог сущностей, служебные компоненты, стили.
- [Расширение](docs/ru/extension.md) — свои сущности, лейауты, валидаторы, конфиг, автономный рендерер.
- [Миграция](MIGRATION-ru.md) — переход со старого основного API и из `/unstable`, конвертация Spec, совместимость через `/deprecated`.
- [Нюансы и ограничения](docs/ru/limitations.md) — проверенные по коду расхождения, ограничения и баги.

## Что это

`src/lib` — движок форм, где форма и обзор значений строятся из одной JSON Schema. Слой `core` не содержит собственных контролов: всё, что рисуется, берётся из конфига. Валидация идёт через `json-schema-library` (Draft-07) плюс кастомное ключевое слово `stringNumber`. Слой `kit` даёт готовый реестр: 30 ключей сущностей на 6 типов узла, 7 ключей лейаутов, служебные компоненты, хук `useExpanded`, тексты ошибок и конвертер `specToJsonSchema` со старого формата Spec.

## Как это работает

1. **Схема и конфиг.** `useSchemaRenderer` клонирует `schema` и кладёт состояние в служебное поле с валидатором.
2. **Узлы.** `SchemaRendererNode` берёт подсхему по указателю, регистрирует поле `final-form`, выбирает `entity` и `layout`.
3. **Изменение.** Правка значения через `validateFields` дёргает только валидатор служебного поля.
4. **Ошибки.** Валидатор раскладывает ошибки по именам в `srState.errors`; перерисовываются узлы с изменившимся сообщением.
5. **Императив.** `useSchemaRendererTools` патчит схему и добавляет внешние ошибки, перезапуская проверку.

## Зависимости

| Пакет                                       | Роль    | Зачем                                                           |
| :------------------------------------------ | :------ | :-------------------------------------------------------------- |
| `react` / `react-dom` / `react-is`          | peer    | 18, 19. Рендер.                                                 |
| `final-form` / `react-final-form`           | peer    | Форма, поля, submit, подписки.                                  |
| `@gravity-ui/uikit`                         | peer    | Версия 8. Контролы kit: TextInput, Select, Checkbox и прочее.   |
| `json-schema-library`                       | runtime | Валидация Draft-07 и кастомный стандарт `stringNumber`.         |
| `decimal.js`                                | runtime | Сравнение чисел и масштаб в `stringNumber` и `*_with_scale`.    |
| `@gravity-ui/date-components`, `date-utils` | runtime | `DateInput` и `DateValue`.                                      |
| `@gravity-ui/icons`                         | runtime | `iconName` у Alert, Label, TextContent.                         |
| `@gravity-ui/i18n`                          | runtime | Локализация текстов ошибок.                                     |
| `@bem-react/classname`, `lodash`, `uuid`    | runtime | Классы, утилиты, ключи.                                         |
| Monaco                                      | внешняя | В пакет не входит. Передаётся через `userContext.MonacoEditor`. |

## I18N

Некоторые компоненты содержат текстовые токены, доступные на двух языках: `en` (по умолчанию) и `ru`. Для настройки языка используйте функцию `configure`:

```js
// index.js

import {configure, Lang} from '@gravity-ui/dynamic-forms';

configure({lang: Lang.Ru});
```

## Разработка

Для запуска Storybook в режиме разработки выполните следующую команду:

```shell
npm ci
npm run dev
```
