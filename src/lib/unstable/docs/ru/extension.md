[← К оглавлению](./README.md)

# Расширение

Как добавить свои сущности, лейауты, валидаторы, подать внешние ошибки, патчить схему и собрать форму вручную. Типы и экспорты — в [справочнике API](./api.md).

## Своя сущность

Компонент типа `NodeEntity` получает `input`, `meta`, схему, режим, `props` и (для `independent`) `Layout`. Значение меняется через `input.onChange`, состояние валидации — через `getValidationState(meta)`.

```tsx
import {TextInput} from '@gravity-ui/uikit';
import {
  getValidationState,
  type NodeEntity,
  type JsonSchemaString,
} from '@gravity-ui/dynamic-forms/unstable';

export const SlugInput: NodeEntity<JsonSchemaString> = ({input, meta, schema}) => (
  <TextInput
    value={input.value ?? ''}
    onUpdate={(next) => input.onChange(next.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}
    onBlur={() => input.onBlur()}
    placeholder={schema.examples?.[0] as string}
    validationState={getValidationState(meta)}
  />
);
```

Регистрация ключа в конфиге и типобезопасный definer:

```tsx
import {
  NodeType,
  untypedConfig,
  defineNodeEntityConfig,
  createNodeParametersDefiner,
} from '@gravity-ui/dynamic-forms/unstable';
import {SlugInput} from './SlugInput';

export const appConfig = {
  ...untypedConfig,
  [NodeType.String]: {
    ...untypedConfig[NodeType.String],
    formEntities: {
      ...untypedConfig[NodeType.String].formEntities,
      slug: defineNodeEntityConfig({Component: SlugInput}),
    },
  },
} as const;

export const defineNodeParameters = createNodeParametersDefiner(appConfig);

// nodeParameters: defineNodeParameters({type: NodeType.String, entity: 'slug', layout: 'row'})
```

Для обзора добавьте пару в `overviewEntities`, иначе в режиме `overview` узел останется без компонента.

## Свой лейаут

Лейаут типа `NodeLayout` получает `children` — уже нарисованную сущность. Заголовок, описание и ошибку берут из контекста узла. Свой лейаут обязан сам отрисовать `EntityError`, иначе текста ошибки не будет.

```tsx
import {Flex} from '@gravity-ui/uikit';
import {
  EntityTitle,
  EntityError,
  LayoutButtons,
  LayoutContainer,
  type NodeLayout,
  type JsonSchema,
} from '@gravity-ui/dynamic-forms/unstable';

// EntityTitle, EntityError, LayoutButtons читают контекст узла.
export const InlineLayout: NodeLayout<JsonSchema> = ({children}) => (
  <LayoutContainer>
    <Flex gap={2} alignItems="center">
      <EntityTitle />
      {children}
      <LayoutButtons />
    </Flex>
    <EntityError />
  </LayoutContainer>
);
```

## Свой валидатор

Функция кладётся в `validators` ветки типа (и вызывается по строковому ключу `nodeParameters.validator`) или прямо в схему. Возврат строки — ошибка этого поля, объекта — ошибки детей по относительным путям, `undefined` — ок. Асинхронный валидатор возвращает промис.

```tsx
import type {Validator, JsonSchemaString} from '@gravity-ui/dynamic-forms/unstable';

// Вернуть строку — ошибка поля, объект — ошибки детей, undefined — ок.
export const uniqueLogin: Validator<JsonSchemaString> = async (value) => {
  if (!value) {
    return undefined;
  }
  const taken = await api.isLoginTaken(value);
  return taken ? 'Такой логин уже занят' : undefined;
};
```

Возврат `true` даёт ошибку без текста — возвращайте строку или `undefined`. Промис не должен отклоняться (см. [Нюансы](./limitations.md)).

## Внешние ошибки после submit

kit строит текст ошибки из `srState.errors`, а не из `submitErrors` final-form. Серверные ошибки отдавайте через `addExternalErrors` с полным путём поля. Они не снимаются при правке — чистите вручную.

```tsx
import {useForm} from 'react-final-form';
import {useSchemaRendererTools} from '@gravity-ui/dynamic-forms/unstable';

function SaveButton() {
  const form = useForm();
  const {addExternalErrors, removeExternalErrors} = useSchemaRendererTools();

  const onSave = async () => {
    // внешние ошибки не снимаются при правке — чистим вручную
    removeExternalErrors({headName: '', removeFunctionOrNames: ['login']});
    const result = await api.save(form.getState().values);
    if (result.fieldErrors) {
      addExternalErrors({headName: '', regularErrors: result.fieldErrors});
    }
  };

  return (
    <button type="button" onClick={onSave}>
      Сохранить
    </button>
  );
}
```

## Динамическая схема

Патчи меняют рабочую копию схемы на лету. `merge` дописывает листья, `replace: true` подменяет узел целиком; замена ветки теряет исходные `nodeParameters` и `title` — переопределяйте их в патче.

```tsx
import {useSchemaRendererTools} from '@gravity-ui/dynamic-forms/unstable';

function useBindRange() {
  const {addSchemaPatches, removeSchemaPatches} = useSchemaRendererTools();

  const setMin = (min: number) =>
    addSchemaPatches({
      patches: [{headName: '', schemaPath: '#/properties/to', schema: {minimum: min}}],
    });

  // schema: true снимает все патчи по этому пути
  const clearMin = () =>
    removeSchemaPatches({
      patchesToRemove: [{headName: '', schemaPath: '#/properties/to', schema: true}],
    });

  return {setMin, clearMin};
}
```

## Автономный рендерер

`useSchemaRenderer` поднимает состояние, ничего не рисуя; куски схемы рисуются вручную через `SchemaRendererNode`. Подходит для мастера по шагам или смешения формы и обзора. С `destroyOnUnregister` значения ушедшего шага очищаются.

```tsx
import {
  useSchemaRenderer,
  SchemaRendererNode,
  SchemaRendererMode,
  config,
  errorMessages,
} from '@gravity-ui/dynamic-forms/unstable';

// Внутри <Form>. Хук поднимает состояние ДО отрисовки узлов.
function WizardBody({schema, step}: {schema: any; step: number}) {
  useSchemaRenderer({
    name: '',
    schema,
    mode: SchemaRendererMode.Form,
    config,
    errorMessages,
    validateOnBlur: false,
  });

  const fields = step === 0 ? ['login', 'email'] : ['password'];

  // Проверка всегда идёт по всей схеме под headName:
  // ошибка на скрытом шаге тоже блокирует submit.
  return fields.map((key) => (
    <SchemaRendererNode key={key} headName="" name={key} schemaPath={'#/properties/' + key} />
  ));
}
```
