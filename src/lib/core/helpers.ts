import _ from 'lodash';

import {SpecTypes} from './constants';
import {ArraySpec, BooleanSpec, NumberSpec, ObjectSpec, StringSpec} from './types';

export const isCorrectSpec = (candidate: any) =>
    _.isObjectLike(candidate) &&
    (candidate.type === SpecTypes.Array ||
        candidate.type === SpecTypes.Boolean ||
        candidate.type === SpecTypes.Number ||
        candidate.type === SpecTypes.Object ||
        candidate.type === SpecTypes.String) &&
    _.isObjectLike(candidate.viewSpec) &&
    _.isString(candidate.viewSpec.type);

export const isArraySpec = (candidate: any): candidate is ArraySpec =>
    candidate?.type === SpecTypes.Array;

export const isBooleanSpec = (candidate: any): candidate is BooleanSpec =>
    candidate?.type === SpecTypes.Boolean;

export const isNumberSpec = (candidate: any): candidate is NumberSpec =>
    candidate?.type === SpecTypes.Number;

export const isObjectSpec = (candidate: any): candidate is ObjectSpec =>
    candidate?.type === SpecTypes.Object;

export const isStringSpec = (candidate: any): candidate is StringSpec =>
    candidate?.type === SpecTypes.String;
