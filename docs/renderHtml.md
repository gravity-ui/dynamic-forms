# renderHtml

## Description

`renderHtml` is an optional property intended for custom rendering of HTML and markdown content in descriptions.
This property is useful when you need to render formatted text (markdown or HTML) keeping it consistent with your project's design and styling.

Type of the property:

```ts
renderHtml?: (text: string) => React.ReactNode;
```

---

## How to use renderHtml?

To use this prop, pass your custom render function to the [DynamicField](./lib.md#dynamicfield) or [DynamicView](./lib.md#dynamicview) components.

Example for [DynamicField](./lib.md#dynamicfield):

```tsx
// Use any third-party library or your custom implementation for HTML rendering
const renderHtml = (text: string) => {
  return <div dangerouslySetInnerHTML={{__html: text}} />;
};

export const MyForm = () => {
  return <DynamicField name="input" spec={spec} config={dynamicConfig} renderHtml={renderHtml} />;
};
```

Example for [DynamicView](./lib.md#dynamicview):

```tsx
const renderHtml = (text: string) => {
  return <div dangerouslySetInnerHTML={{__html: text}} />;
};

export const MyView = () => {
  return (
    <DynamicView value={value} spec={spec} config={dynamicViewConfig} renderHtml={renderHtml} />
  );
};
```

---

### Tips for using renderHtml:

- You can use any third-party libraries (for example, `@gravity-ui/markdown-editor`, `@diplodoc/transform`, etc.) to ensure safer and more effective rendering of markdown or HTML content.
- If your custom components (for instance, custom layout or custom input components) also require markdown or HTML rendering capabilities, be sure to leverage the built-in hook `useRenderHtml()` for convenient access to the rendering function within child components.
