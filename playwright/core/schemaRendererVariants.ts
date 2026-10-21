import type {SchemaRendererProps} from '../../src/lib/unstable/core/SchemaRenderer';

export const rendererSizes = ['s', 'm', 'l', 'xl'] as const satisfies ReadonlyArray<
    SchemaRendererProps['size']
>;
export const rendererViews = ['fit', 'stretch'] as const satisfies ReadonlyArray<
    SchemaRendererProps['view']
>;
export const rendererLayouts = [
    undefined,
    'accordeon',
    'card',
    'cell',
    'column',
    'row',
    'section',
    'transparent',
] as const;

// Every layout × size pair, with both views represented for every layout and size.
// These are named test cases, not fallback values supplied by the mount fixture.
export const rendererVariants = rendererLayouts.flatMap((layout, layoutIndex) =>
    rendererSizes.map((size, sizeIndex) => ({
        layout,
        layoutName: layout ?? 'no-layout',
        size,
        view: rendererViews[(layoutIndex + sizeIndex) % rendererViews.length],
    })),
);
