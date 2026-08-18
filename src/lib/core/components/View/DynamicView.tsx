import React from 'react';

import {isValidElementType} from 'react-is';
import type {MonacoEditorProps} from 'react-monaco-editor/lib/types';

import {collectDottedPropertyKeys, isCorrectSpec} from '../../helpers';
import type {FormValue, Spec} from '../../types';

import {ViewController} from './ViewController';
import {isCorrectViewConfig} from './helpers';
import {useCreateContext, useViewSharedStore} from './hooks';
import type {DynamicViewConfig} from './types';

export interface DynamicViewProps {
    value: FormValue;
    spec: Spec;
    config: DynamicViewConfig;
    Link?: React.ComponentType<{
        value: FormValue;
        link: Spec['viewSpec']['link'];
    }>;
    Monaco?: React.ComponentType<MonacoEditorProps>;
    showLayoutDescription?: boolean;
    shared?: Record<string, any>;
}

export const DynamicView = ({
    value,
    spec,
    config,
    Link,
    Monaco,
    showLayoutDescription,
    shared: externalShared,
}: DynamicViewProps) => {
    const DynamicFormsCtx = useCreateContext();
    const shared = useViewSharedStore(externalShared);

    React.useEffect(() => {
        if (process.env.NODE_ENV !== 'production') {
            const dottedKeys = collectDottedPropertyKeys(spec);

            if (dottedKeys.length) {
                console.warn(
                    `[dynamic-forms] Spec property keys containing dots are not supported, their values will not be resolved: ${dottedKeys.join(
                        ', ',
                    )}. See docs/lib.md#dotted-property-keys`,
                );
            }
        }
    }, [spec]);

    const context = React.useMemo(
        () => ({
            config,
            value,
            showLayoutDescription,
            Link,
            Monaco: isValidElementType(Monaco) ? Monaco : undefined,
            shared,
        }),
        [config, value, Link, Monaco, showLayoutDescription, shared],
    );

    if (isCorrectSpec(spec) && isCorrectViewConfig(config)) {
        return (
            <DynamicFormsCtx.Provider value={context}>
                <ViewController spec={spec} name="" />
            </DynamicFormsCtx.Provider>
        );
    }

    return null;
};
