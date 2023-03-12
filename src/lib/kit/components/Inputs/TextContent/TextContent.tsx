import React from 'react';

import {Label} from '@gravity-ui/uikit';

import {StringIndependentInputProps} from '../../../../core';
import {block} from '../../../utils';

import './TextContent.scss';

const b = block('text-content');

export const TextContent: React.FC<StringIndependentInputProps> = ({
    spec,
    Layout,
    ...restProps
}) => {
    const {themeLabel, layoutDescription} = spec.viewSpec;

    if (!layoutDescription) {
        return null;
    }

    let content = <span dangerouslySetInnerHTML={{__html: layoutDescription}} />;

    if (themeLabel) {
        content = (
            <Label size="m" theme={themeLabel} className={b()}>
                {content}
            </Label>
        );
    }

    if (Layout) {
        const _spec = {...spec, viewSpec: {...spec.viewSpec, layoutDescription: undefined}};

        return (
            <Layout spec={_spec} {...restProps}>
                {content}
            </Layout>
        );
    }

    return content;
};
