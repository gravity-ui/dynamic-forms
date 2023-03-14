import React from 'react';

import _ from 'lodash';

import {FormValue, Spec, ViewLayoutProps} from '../../../../core';
import {isNotEmptyValue} from '../../../utils';
import {SectionCard, SectionCard2} from '../../Layouts';

export const ViewSectionCard = <T extends FormValue, S extends Spec>(
    props: ViewLayoutProps<T, S>,
) =>
    isNotEmptyValue(props.value, props.spec) ? <SectionCard {...props} ignoreDescription /> : null;

export const ViewSectionCard2 = <T extends FormValue, S extends Spec>(
    props: ViewLayoutProps<T, S>,
) =>
    isNotEmptyValue(props.value, props.spec) ? <SectionCard2 {...props} ignoreDescription /> : null;
