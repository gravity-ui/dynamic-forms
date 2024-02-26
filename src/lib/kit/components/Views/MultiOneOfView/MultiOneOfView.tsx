import React from 'react';

import {Popover} from '@gravity-ui/uikit';
import isObjectLike from 'lodash/isObjectLike';

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
        () => (isObjectLike(spec.properties) ? spec.properties! : {}),
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

    const selectView = React.useMemo(() => {
        const selectView = (
            <React.Fragment>
                {items.map((item) => {
                    return (
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
                    );
                })}
            </React.Fragment>
        );

        if (Layout) {
            return (
                <Layout {...props} value={values as any}>
                    {selectView}
                </Layout>
            );
        }

        return <React.Fragment>{selectView}</React.Fragment>;
    }, [Layout, items, props, values]);

    if (values.length === 0) {
        return null;
    }

    return (
        <React.Fragment>
            {selectView}
            <div
                className={b('content', {flat: withoutIndent, 'multiple-values': items.length > 1})}
            >
                <GroupIndent>
                    {values.map((value) => (
                        <React.Fragment key={value}>
                            {specProperties && specProperties[value] ? (
                                <ViewController
                                    name={`${name ? name + '.' : ''}${value}`}
                                    spec={specProperties[value]}
                                />
                            ) : null}
                        </React.Fragment>
                    ))}
                </GroupIndent>
            </div>
        </React.Fragment>
    );
};

export const MultiOneOfFlatView: ObjectIndependentView = (props) => (
    <MultiOneOfView {...props} withoutIndent />
);
