import React from 'react';

import isObjectLike from 'lodash/isObjectLike';
import {Text} from '@gravity-ui/uikit';

import {ObjectIndependentView, ObjectIndependentViewProps, ViewController} from '../../../../core';
import {block, filterPropertiesForObjectInline} from '../../../utils';
import {MAX_LENGTH_DELIMITER} from '../../../constants';

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
    const content = React.useMemo(() => {
        if (!spec.properties || !isObjectLike(spec.properties)) {
            return null;
        }

        const specProperties = inline
            ? filterPropertiesForObjectInline(spec.properties)
            : spec.properties;

        const delimiter =
            inline && spec.viewSpec.delimiter
                ? spec.viewSpec.delimiter.substring(0, MAX_LENGTH_DELIMITER)
                : null;

        const orderProperties = spec.viewSpec.order || Object.keys(specProperties);

        return (
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
    }, [inline, name, spec.properties, spec.viewSpec.delimiter, spec.viewSpec.order]);

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
