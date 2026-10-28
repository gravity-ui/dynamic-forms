import React from 'react';

import type {FormValue, Spec, ViewLayoutProps} from '../../../../core';
import {isNotEmptyValue} from '../../../utils';
import {Group, Group2, Section, Section2} from '../../Layouts';

export const ViewSection = <T extends FormValue, S extends Spec>(props: ViewLayoutProps<T, S>) =>
    isNotEmptyValue(props.value, props.spec) ? <Section {...props} ignoreDescription /> : null;

export const ViewSection2 = <T extends FormValue, S extends Spec>(props: ViewLayoutProps<T, S>) =>
    isNotEmptyValue(props.value, props.spec) ? <Section2 {...props} ignoreDescription /> : null;

export const ViewGroup = <T extends FormValue, S extends Spec>(props: ViewLayoutProps<T, S>) =>
    isNotEmptyValue(props.value, props.spec) ? <Group {...props} ignoreDescription /> : null;

export const ViewGroup2 = <T extends FormValue, S extends Spec>(props: ViewLayoutProps<T, S>) =>
    isNotEmptyValue(props.value, props.spec) ? <Group2 {...props} ignoreDescription /> : null;
