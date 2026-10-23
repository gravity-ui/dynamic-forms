import React from 'react';

import {SchemaForm, type SchemaFormProps} from './SchemaForm';

export interface SchemaFormGridProps {
    /** Fixed outer height in CSS pixels, shared by all sizes and views. */
    caseHeight: number;
    cases: Array<{
        label: string;
        props: SchemaFormProps;
        /** Override for a state that needs extra room, such as an open calendar. */
        height?: number;
    }>;
}

// Fixed frames keep later cases in place if a component changes its dimensions.
// Overflow stays visible in the screenshot instead of being clipped away.
export const SchemaFormGrid = ({caseHeight, cases}: SchemaFormGridProps) => (
    <div
        style={{
            display: 'grid',
            gridTemplateColumns: 'max-content',
            alignItems: 'start',
            gap: 16,
        }}
    >
        {cases.map(({label, props, height}) => (
            <section
                key={label}
                aria-label={label}
                data-qa="schema-variant"
                style={{
                    boxSizing: 'border-box',
                    height: height ?? caseHeight,
                    width: props.width + 26,
                    padding: 12,
                    border: '1px solid var(--g-color-line-generic)',
                }}
            >
                <div data-qa="schema-variant-title" style={{marginBottom: 12, fontWeight: 600}}>
                    {label}
                </div>
                <SchemaForm {...props} />
            </section>
        ))}
    </div>
);
