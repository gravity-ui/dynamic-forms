import React from 'react';

import {isEmpty} from 'lodash';

import {Alert, Label, Text} from '@gravity-ui/uikit';
import cloneDeep from 'lodash/cloneDeep';

import {StringIndependentInput, StringSpec} from '../../../../core';
import {block} from '../../../utils';
import {LazyLoader} from '../../LazyLoader';

import {loadIcon} from './utils';

import './TextContent.scss';

const b = block('text-content');

export interface TextContentComponentProps {
    spec: StringSpec;
    value?: string;
    Layout?: React.FC<{spec: StringSpec; children: React.ReactElement}>;
}

export const TextContentComponent: React.FC<TextContentComponentProps> = ({
    spec,
    value,
    Layout,
}) => {
    const {textContentParams, layoutDescription} = spec.viewSpec;

    const text = React.useMemo(
        () => (textContentParams?.text ? textContentParams?.text : layoutDescription),
        [layoutDescription, textContentParams?.text],
    );

    if (!text) {
        return null;
    }

    const iconLib = textContentParams?.icon ? (
        <LazyLoader component={loadIcon(textContentParams?.icon)} />
    ) : null;

    let content = <span dangerouslySetInnerHTML={{__html: text}} />;

    if (textContentParams?.themeAlert) {
        const titleAlert =
            textContentParams?.titleAlert || !isEmpty(textContentParams?.titleAlert)
                ? textContentParams.titleAlert
                : undefined;

        content = (
            <Alert
                icon={iconLib}
                message={content}
                // If the title is an empty line, then you need to explicitly write undefined, otherwise there will be an additional indent
                title={titleAlert}
                theme={textContentParams?.themeAlert}
                view={textContentParams?.viewAlert}
            />
        );
    } else if (textContentParams?.themeLabel) {
        content = (
            <Label
                size="m"
                theme={textContentParams.themeLabel}
                className={b()}
                value={value}
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
                {value ? (
                    <React.Fragment>
                        <Text className={b('separator')}>:</Text>
                        <Text color="secondary">{value}</Text>
                    </React.Fragment>
                ) : null}
            </div>
        );
    }

    if (Layout) {
        const _spec = cloneDeep(spec);

        if (!textContentParams?.text) {
            _spec.viewSpec.layoutDescription = undefined;
        }

        return <Layout spec={_spec}>{content}</Layout>;
    }

    return content;
};

export const TextContent: StringIndependentInput = ({
    name,
    spec,
    Layout,
    input,
    arrayInput,
    meta,
    layoutProps,
}) => {
    const WrappedLayout = React.useMemo(() => {
        if (Layout) {
            const Component: TextContentComponentProps['Layout'] = (props) => {
                return (
                    <Layout
                        name={name}
                        input={input}
                        layoutProps={layoutProps}
                        arrayInput={arrayInput}
                        meta={meta}
                        {...props}
                    />
                );
            };

            return Component;
        }

        return undefined;
    }, [Layout, layoutProps, input, arrayInput, meta, name]);

    return <TextContentComponent spec={spec} value={input.value} Layout={WrappedLayout} />;
};
