[← К оглавлению](./README.md)

# Как использовать

Рендерер ставится внутри `Form` из `react-final-form` — поля регистрируются сами, отдельный `Field` не нужен. Полный перечень пропсов и хуков см. в [справочнике API](./api.md).

## Быстрый старт

```tsx
import {Form} from 'react-final-form';
import {
  SchemaRenderer,
  JsonSchemaType,
  NodeType,
  SchemaRendererMode,
  config,
  errorMessages,
  type JsonSchema,
} from '@gravity-ui/dynamic-forms/unstable';

const schema: JsonSchema = {
  type: JsonSchemaType.Object,
  nodeParameters: {type: NodeType.Object, entity: 'base'},
  required: ['login'],
  properties: {
    login: {
      type: JsonSchemaType.String,
      title: 'Логин',
      minLength: 1,
      nodeParameters: {type: NodeType.String, entity: 'base', layout: 'row'},
    },
  },
};

function ProfileForm() {
  return (
    <Form onSubmit={(values) => console.log(values)}>
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
          <button type="submit">Сохранить</button>
        </form>
      )}
    </Form>
  );
}
```

`config` и `errorMessages` — готовые экспорты из `kit`. `validateOnBlur` должен совпадать со значением на `<Form validateOnBlur>` (подробнее — в [рантайме](./runtime.md#валидация)).

## Проп name — куда ложится значение

Имя рендерера — это путь корня в значении `final-form`.

| `name`           | Куда пишет        | Пример                                      |
| :--------------- | :---------------- | :------------------------------------------ |
| `name=""`        | Весь объект формы | Схема с полем `login` пишет `values.login`. |
| `name="profile"` | Поддерево         | То же поле пишет `values.profile.login`.    |

В одной `Form` может быть несколько рендереров с разными `name`, каждый со своим служебным полем.

## Режимы form и overview

Проп `mode` переключает отрисовку одной и той же схемы.

- `SchemaRendererMode.Form` — берутся `formEntities` и `formLayouts`. Узел с `readOnly: true` в форме не рисуется; чтобы показать заблокированное поле, используйте `flags.disabled`.
- `SchemaRendererMode.Overview` — берутся `overviewEntities` и `overviewLayouts`. Узел с `writeOnly: true` в обзоре не рисуется; пустые значения обычно скрываются.

## Когда что брать

| API                                        | Когда                                                                                                                                             |
| :----------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| `SchemaRenderer`                           | Нарисовать всю схему в одном месте. 90% случаев.                                                                                                  |
| `useSchemaRenderer` + `SchemaRendererNode` | Куски схемы разбросаны по странице: мастер по шагам, своя вёрстка, смешение формы и обзора. См. [Расширение](./extension.md#автономный-рендерер). |
| `useSchemaRendererState`                   | Компоненту нужны ошибки, режим, `submitCount` или рабочая схема рендерера.                                                                        |
