import React from 'react';

import _ from 'lodash';
import {isValidElementType} from 'react-is';

import {ObjectIndependentView, StringSpec} from '../../../../core';
import {useComponents, useDynamicFormsCtx} from '../../../../core/components/View/hooks';

const TEXT_LINK_PROPERTY_NAME = 'text';

export const TextLinkView: ObjectIndependentView = ({value, spec, name}) => {
    const {Link} = useDynamicFormsCtx();

    const specProperties = {...spec.properties};

    const {Layout} = useComponents(specProperties[TEXT_LINK_PROPERTY_NAME]);

    const valueText = value?.text ? value.text : false;

    if (!specProperties[TEXT_LINK_PROPERTY_NAME] && !valueText && !_.isString(valueText)) {
        return null;
    }

    const text =
        (specProperties[TEXT_LINK_PROPERTY_NAME] as StringSpec)?.description?.[String(valueText)] ||
        String(valueText);

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
