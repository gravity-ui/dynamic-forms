import React from 'react';

import cloneDeep from 'lodash/cloneDeep';

import {ObjectIndependentView, ViewController, isStringSpec} from '../../../../core';

const TEXT_LINK_PROPERTY_NAME = 'text';

export const TextLinkView: ObjectIndependentView = ({value, spec, name, Layout, ...restProps}) => {
    const childSpec = React.useMemo(() => {
        if (
            spec.properties?.[TEXT_LINK_PROPERTY_NAME] &&
            isStringSpec(spec.properties[TEXT_LINK_PROPERTY_NAME])
        ) {
            const childSpec = cloneDeep(spec.properties[TEXT_LINK_PROPERTY_NAME]);

            childSpec.viewSpec.layout = '';
            childSpec.viewSpec.link = value?.link;

            return childSpec;
        }

        return undefined;
    }, [spec.properties, value?.link]);

    if (!childSpec || !value?.text) {
        return null;
    }

    const content = (
        <ViewController
            spec={childSpec}
            name={`${name ? name + '.' : ''}${TEXT_LINK_PROPERTY_NAME}`}
        />
    );

    if (Layout) {
        return (
            <Layout spec={spec} name={name} value={value} {...restProps}>
                {content}
            </Layout>
        );
    }

    return <React.Fragment>{content}</React.Fragment>;
};
