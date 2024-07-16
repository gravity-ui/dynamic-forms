import React from 'react';

import type {MonacoEditorProps} from 'react-monaco-editor/lib/types';

import {FormValue, Spec} from '../../../types';

import {DynamicViewConfig} from './';

export interface DynamicViewContext {
    config: DynamicViewConfig;
    value: FormValue;
    showLayoutDescription?: boolean;
    Link?: React.ComponentType<{
        value: FormValue;
        link: Spec['viewSpec']['link'];
    }>;
    Monaco?: React.ComponentType<MonacoEditorProps>;
}
