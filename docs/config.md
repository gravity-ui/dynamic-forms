## Config

`Config` is an object that contains [Inputs](#inputs), [Layouts](#layouts), and [Validators](#validators) for each entity. You can modify, replace, or write your own configuration file.

[Default config](../src/lib/kit/constants/config.tsx)

### Inputs

`Inputs` are components, such as text fields, selectors, checkboxes, and so on, that allow users to interact with the form. `Inputs` are classified into two types: simple and independent. A `simple` `Input` [Controller](./lib.md#controller) wraps in [Layout](#layouts), while an `independent` `Input` [Controller](./lib.md#controller) is passed [Layout](#layouts) into a prop, allowing the component to wrap itself.

```typescript
type InputEntity = {
  Component: React.ComponentType<
    {
      spec: Spec;
      name: string;
    } & FieldRenderProps
  >;
  independent?: false;
};
```

```typescript
type IndependentInputEntity = {
  Component: React.ComponentType<
    {
      spec: Spec;
      name: string;
      Layout: LayoutType | undefined;
    } & FieldRenderProps
  >;
  independent: true;
};
```

### Layouts

`Layouts` are components, such as sections, cards, and accordions, that wrap the [Input](#inputs). `Layouts` receive the same props as inputs, excluding the `Layout`.

```typescript
type LayoutType = React.ComponentType<
  {
    spec: Spec;
    name: string;
  } & FieldRenderProps
>;
```

### Validators

`Validators` are functions that validate field values using [spec](./spec.md#specs). If the `validator` parameter is not specified in the [spec](./spec.md#specs), the default value from the [config](#config) is used.

```typescript
(spec: Spec, value?: Value) => string | boolean | undefined | Promise<string | boolean | undefined>;
```

## ViewConfig

`ViewConfig` is an object that contains the [Views](#views) and [ViewLayouts](#viewlayouts) associated with each entity. You can modify, replace, or write your own configuration file.

[Default config](../src/lib/kit/constants/config.tsx)

### Views

`Views` are the components responsible for rendering the entity value. There can be two types of views: simple and independent. A `simple` `View` [ViewController](./lib.md#viewcontroller) wraps in [ViewLayout](#viewlayouts), whereas an `independent` `View` [ViewController](./lib.md#viewcontroller) is passed [ViewLayout](#viewlayouts) into the props, allowing the component to wrap itself.

```typescript
type ViewEntity = {
  Component: React.ComponentType<{
    spec: Spec;
    name: string;
    value?: FormValue;
    linkValue?: React.ReactElement;
  }>;
  independent?: false;
};
```

```typescript
type IndependentViewEntity = {
  Component: React.ComponentType<{
    spec: Spec;
    name: string;
    value?: FormValue;
    linkValue?: React.ReactElement;
    Layout: ViewLayoutType | undefined;
  }>;
  independent: true;
};
```

### ViewLayouts

`ViewLayouts` are the components, such as sections, cards, accordions, and so on, that wrap [View](#views). The `ViewLayout` receives the same props as in [View](#views), excluding `linkValue` and the `ViewLayout`.

```typescript
type ViewLayoutType = React.ComponentType<{
  spec: Spec;
  name: string;
  value?: FormValue;
}>;
```
