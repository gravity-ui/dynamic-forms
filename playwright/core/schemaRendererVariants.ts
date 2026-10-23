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

// Full layout × size × view product, ordered for a single vertical column.
// These are named test cases, not fallback values supplied by the mount fixture.
export const rendererVariants = rendererLayouts.flatMap((layout) =>
    rendererSizes.flatMap((size) =>
        rendererViews.map((view) => ({
            layout,
            layoutName: layout ?? 'no-layout',
            size,
            view,
        })),
    ),
);
