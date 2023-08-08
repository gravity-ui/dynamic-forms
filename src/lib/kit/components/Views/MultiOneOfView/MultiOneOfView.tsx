import React from 'react';

import {Popover} from '@gravity-ui/uikit';
import _ from 'lodash';

import {ObjectIndependentView, ObjectIndependentViewProps, ViewController} from '../../../../core';
import {block} from '../../../utils';
import {GroupIndent} from '../../GroupIndent';

import './MultiOneOfView.scss';

const b = block('multi-oneof-view');

export interface MultiOneOfViewProps extends ObjectIndependentViewProps {
    withoutIndent?: boolean;
}

export const MultiOneOfView: React.FC<MultiOneOfViewProps> = (props) => {
    const {name, value, Layout, spec, withoutIndent} = props;

    const specProperties = React.useMemo(
        () => (_.isObjectLike(spec.properties) ? spec.properties! : {}),
        [spec.properties],
    );

    const values = React.useMemo(() => Object.keys(value || []), [value]);

    const items = React.useMemo(
        () =>
            values.map((value) => {
                const title =
                    spec.description?.[value] ||
                    specProperties[value]?.viewSpec.layoutTitle ||
                    value ||
                    '';

                return title;
            }),
        [spec.description, specProperties, values],
    );

    const content = React.useMemo(
        () => (
            <React.Fragment>
                {values.map((value) => (
                    <React.Fragment key={value}>
                        {specProperties && specProperties[value] ? (
                            <ViewController
                                name={`${name}.${value}`}
                                spec={specProperties[value]}
                            />
                        ) : null}
                    </React.Fragment>
                ))}
            </React.Fragment>
        ),
        [name, specProperties, values],
    );

    const header = React.useMemo(
        () => (
            <React.Fragment>
                {items.map((item) => (
                    <Popover
                        placement={['bottom', 'top']}
                        key={item}
                        content={item}
                        className={b('tooltip-container')}
                        contentClassName={b('tooltip')}
                        disabled={item.length < 51}
                    >
                        {item}
                    </Popover>
                ))}
            </React.Fragment>
        ),
        [items],
    );

    if (!value) {
        return null;
    }

    if (Layout) {
        return (
            <React.Fragment>
                <Layout {...props}>{header}</Layout>
                {content}
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            {header}
            <div className={b('content', {flat: withoutIndent})}>
                <GroupIndent>{content}</GroupIndent>
            </div>
        </React.Fragment>
    );
};

export const MultiOneOfFlatView: ObjectIndependentView = (props) => (
    <MultiOneOfView {...props} withoutIndent />
);
