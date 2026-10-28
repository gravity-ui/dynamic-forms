# @gravity-ui/dynamic-forms &middot; [![npm package](https://img.shields.io/npm/v/@gravity-ui/dynamic-forms)](https://www.npmjs.com/package/@gravity-ui/dynamic-forms) [![CI](https://img.shields.io/github/actions/workflow/status/gravity-ui/dynamic-forms/.github/workflows/ci.yml?label=CI&logo=github)](https://github.com/gravity-ui/dynamic-forms/actions/workflows/ci.yml?query=branch:main) [![storybook](https://img.shields.io/badge/Storybook-deployed-ff4685)](https://preview.gravity-ui.com/dynamic-forms/)

Библиотека для рендеринга форм и их значений на основе `JSON Schema`.

## Установка

```shell
npm install --save-dev @gravity-ui/dynamic-forms
```

## Использование

```jsx
import {DynamicField, Spec, dynamicConfig} from '@gravity-ui/dynamic-forms';

// To embed in a final-form
<DynamicField name={name} spec={spec} config={config} />;

import {DynamicView, dynamicViewConfig} from '@gravity-ui/dynamic-forms';

// To get an overview of the values
<DynamicView value={value} spec={spec} config={dynamicViewConfig} />;
```

### I18N

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
