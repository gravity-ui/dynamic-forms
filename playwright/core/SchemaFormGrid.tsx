import React from 'react';

import {SchemaForm, type SchemaFormProps} from './SchemaForm';

export interface SchemaFormGridProps {
    columns: number;
    cases: Array<{
        label: string;
        props: SchemaFormProps;
        spaceBelow?: number;
    }>;
}

// Render the list in the browser; each case supplies the complete form props.
export const SchemaFormGrid = ({columns, cases}: SchemaFormGridProps) => (
    <div
        style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, max-content)`,
            alignItems: 'start',
            gap: 16,
        }}
    >
        {cases.map(({label, props, spaceBelow}) => (
            <SchemaFormCase key={label} label={label}>
                <div style={{paddingBottom: spaceBelow}}>
                    <SchemaForm {...props} />
                </div>
            </SchemaFormCase>
        ))}
    </div>
);

const SchemaFormCase = ({label, children}: {label: string; children: React.ReactNode}) => (
    <section
        aria-label={label}
        data-qa="schema-variant"
        style={{padding: 12, border: '1px solid var(--g-color-line-generic)'}}
    >
        <div data-qa="schema-variant-title" style={{marginBottom: 12, fontWeight: 600}}>
            {label}
        </div>
        {children}
    </section>
);
