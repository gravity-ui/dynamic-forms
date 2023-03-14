import React from 'react';

import type {MonacoEditorProps} from 'react-monaco-editor/lib/types';

import {AnyObject, FormValue, Spec} from '../../../types';

import {DynamicViewConfig} from './';

export interface DynamicViewContext {
    config: DynamicViewConfig;
    value: AnyObject;
    Link?: React.ComponentType<{
        value: FormValue;
        link: Spec['viewSpec']['link'];
    }>;
    Monaco?: React.ComponentType<MonacoEditorProps>;
}
