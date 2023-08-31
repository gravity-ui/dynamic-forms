import React from 'react';

import {Label, Text} from '@gravity-ui/uikit';
import _ from 'lodash';

import {StringIndependentInputProps} from '../../../../core';
import {block} from '../../../utils';
import {LazyLoader} from '../../LazyLoader';

import {loadIcon} from './utils';

import './TextContent.scss';

const b = block('text-content');

export const TextContent: React.FC<StringIndependentInputProps> = ({
    spec,
    Layout,
    input,
    ...restProps
}) => {
    const {textContentParams} = spec.viewSpec;

    if (!textContentParams?.text) {
        return null;
    }

    const iconLib = textContentParams.icon ? (
        <LazyLoader component={loadIcon(textContentParams.icon)} />
    ) : null;

    let content = <span dangerouslySetInnerHTML={{__html: textContentParams.text}} />;

    if (textContentParams.themeLabel) {
        content = (
            <Label
                size="m"
                theme={textContentParams.themeLabel}
                className={b()}
                value={input.value}
                icon={iconLib}
            >
                {content}
            </Label>
        );
    } else {
        content = (
            <div className={b('wrapper')}>
                {iconLib ? (
                    <Text color={spec.viewSpec.textContentParams?.iconColor} className={b('icon')}>
                        {iconLib}
                    </Text>
                ) : null}
                {content}
                {input.value ? (
                    <React.Fragment>
                        <span className={b('separator')}>:</span>
                        <Text color="secondary">{input.value}</Text>
                    </React.Fragment>
                ) : null}
            </div>
        );
    }

    if (Layout) {
        return (
            <Layout spec={spec} input={input} {...restProps}>
                {content}
            </Layout>
        );
    }

    return content;
};
