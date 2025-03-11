import type React from 'react';

import type {MonacoEditorProps} from 'react-monaco-editor/lib/types';

import type {FormValue, Spec} from '../../../types';

import type {DynamicViewConfig} from './';

export interface DynamicViewContext {
    config: DynamicViewConfig;
    value: FormValue;
    showLayoutDescription?: boolean;
    Link?: React.ComponentType<{
        value: FormValue;
        link: Spec['viewSpec']['link'];
    }>;
    Monaco?: React.ComponentType<MonacoEditorProps>;
    shared: {
        store: Record<string, any>;
        onChangeShared: (name: string, value: any) => void;
    };
}
