import React from 'react';

import isObjectLike from 'lodash/isObjectLike';

import {ObjectIndependentView, ObjectIndependentViewProps, ViewController} from '../../../../core';
import {block, filterPropertiesForObjectInline} from '../../../utils';

import './ObjectBaseView.scss';

const b = block('object-base-view');

export interface ObjectBaseViewProps extends ObjectIndependentViewProps {
    inline?: boolean;
}

export const ObjectBaseView: React.FC<ObjectBaseViewProps> = ({
    inline,
    spec,
    name,
    Layout,
    ...restProps
}) => {
    if (!spec.properties || !isObjectLike(spec.properties)) {
        return null;
    }

    const specProperties = inline
        ? filterPropertiesForObjectInline(spec.properties)
        : spec.properties;

    const content = (
        <div className={b('content', {inline})}>
            {(spec.viewSpec.order || Object.keys(specProperties)).map((property: string) =>
                specProperties[property] ? (
                    <ViewController
                        spec={specProperties[property]}
                        name={`${name ? name + '.' : ''}${property}`}
                        key={`${name ? name + '.' : ''}${property}`}
                    />
                ) : null,
            )}
        </div>
    );

    if (!Layout) {
        return content;
    }

    return (
        <Layout spec={spec} name={name} {...restProps}>
            {content}
        </Layout>
    );
};

export const ObjectInlineView: ObjectIndependentView = (props) => {
    return <ObjectBaseView {...props} inline />;
};
