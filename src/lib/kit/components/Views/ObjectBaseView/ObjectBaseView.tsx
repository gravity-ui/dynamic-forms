import React from 'react';

import isObjectLike from 'lodash/isObjectLike';
import {Text} from '@gravity-ui/uikit';

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

    const delimiter =
        inline && spec.viewSpec.delimiter ? spec.viewSpec.delimiter.substring(0, 5) : null;

    const orderProperties = spec.viewSpec.order || Object.keys(specProperties);

    const content = (
        <div className={b('content', {inline})}>
            {orderProperties.map((property: string, idx: number) =>
                specProperties[property] ? (
                    <React.Fragment key={`${name ? name + '.' : ''}${property}`}>
                        <ViewController
                            spec={specProperties[property]}
                            name={`${name ? name + '.' : ''}${property}`}
                        />
                        {delimiter && orderProperties.length - 1 !== idx ? (
                            <Text className={b('delimiter')}>{delimiter}</Text>
                        ) : null}
                    </React.Fragment>
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
