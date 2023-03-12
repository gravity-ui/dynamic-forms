import React from 'react';

import _ from 'lodash';

import {ObjectIndependentView, Spec, ViewController} from '../../../core';

export const ObjectBaseView: ObjectIndependentView = ({spec, name, Layout, ...restProps}) => {
    if (!_.isObjectLike(spec.properties)) {
        return null;
    }

    const specProperties = {...spec.properties} as Record<string, Spec>;
    const content = (
        <React.Fragment>
            {(spec.viewSpec.order || Object.keys(specProperties)).map((property: string) =>
                specProperties[property] ? (
                    <ViewController
                        spec={specProperties[property]}
                        name={`${name ? name + '.' : ''}${property}`}
                        key={`${name ? name + '.' : ''}${property}`}
                    />
                ) : null,
            )}
        </React.Fragment>
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
