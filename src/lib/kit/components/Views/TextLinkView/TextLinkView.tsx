import React from 'react';

import _ from 'lodash';
import {isValidElementType} from 'react-is';

import {ObjectIndependentView, isStringSpec} from '../../../../core';
import {useComponents, useDynamicFormsCtx} from '../../../../core/components/View/hooks';

const TEXT_LINK_PROPERTY_NAME = 'text';

export const TextLinkView: ObjectIndependentView = ({value, spec, name}) => {
    const {Link} = useDynamicFormsCtx();

    const specProperties = {...spec.properties};

    const {Layout} = useComponents(specProperties[TEXT_LINK_PROPERTY_NAME]);

    const valueText = value?.text ? value.text : undefined;

    if (
        !specProperties[TEXT_LINK_PROPERTY_NAME] ||
        !_.isString(valueText) ||
        !isStringSpec(specProperties[TEXT_LINK_PROPERTY_NAME])
    ) {
        return null;
    }

    const text = specProperties[TEXT_LINK_PROPERTY_NAME]?.description?.[valueText] || valueText;

    let content = <React.Fragment>{text}</React.Fragment>;

    if (_.isString(value?.link) && isValidElementType(Link) && value?.link) {
        content = <Link value={text} link={value.link} />;
    }

    if (!Layout) {
        return content;
    }

    return (
        <Layout
            spec={specProperties[TEXT_LINK_PROPERTY_NAME]}
            name={`${name}.${TEXT_LINK_PROPERTY_NAME}`}
            value={text}
        >
            {content}
        </Layout>
    );
};
