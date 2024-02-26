import cloneDeep from 'lodash/cloneDeep';

import {
    ObjectSpec,
    Spec,
    SpecTypes,
    isArraySpec,
    isBooleanSpec,
    isNumberSpec,
    isObjectSpec,
    isStringSpec,
} from '../../../lib';

import {
    getArrayOptions,
    getBooleanOptions,
    getNumberOptions,
    getObjectOptions,
    getStringOptions,
} from './constants';

export const transformCorrect = (spec: Spec) => {
    const _spec = cloneDeep(spec);

    if (isArraySpec(_spec) && _spec.items) {
        _spec.items = {
            [_spec.items.type]: transformCorrect(_spec.items),
        } as unknown as Spec;
    }

    if ((isArraySpec(_spec) || isObjectSpec(_spec) || isStringSpec(_spec)) && _spec.description) {
        const correctDescription = _spec.description;

        _spec.description = Object.keys(correctDescription).map((key) => ({
            property: key,
            label: correctDescription[key],
        })) as unknown as Record<string, string>;
    }

    if (isObjectSpec(_spec) && _spec.properties) {
        const correctProperties = _spec.properties;

        _spec.properties = Object.keys(correctProperties).map((key) => ({
            key,
            property: {
                [correctProperties[key].type]: transformCorrect(correctProperties[key]),
            },
        })) as unknown as Record<string, Spec>;
    }

    if (isStringSpec(_spec) && _spec.viewSpec.sizeParams?.scale) {
        const correctScale = _spec.viewSpec.sizeParams.scale;

        _spec.viewSpec.sizeParams.scale = Object.keys(correctScale).map((key) => ({
            type: key,
            factor: correctScale[key].factor,
            title: correctScale[key].title,
        })) as unknown as Record<string, {factor: string; title: string}>;
    }

    if (isStringSpec(_spec) && _spec.viewSpec.selectParams?.meta) {
        const correctMeta = _spec.viewSpec.selectParams.meta;

        _spec.viewSpec.selectParams.meta = Object.keys(correctMeta).map((key) => ({
            property: key,
            text: correctMeta[key],
        })) as unknown as Record<string, string>;
    }

    return _spec;
};

export const transformIncorrect = (spec: Spec) => {
    const _spec = cloneDeep(spec);

    if (isArraySpec(_spec) && _spec.items) {
        const incorrectItems = _spec.items as unknown as Record<SpecTypes, Spec>;
        const type = Object.keys(incorrectItems)[0] as SpecTypes;

        _spec.items = transformIncorrect({
            ...incorrectItems[type],
            type,
        } as unknown as Spec);
    }

    if ((isArraySpec(_spec) || isObjectSpec(_spec) || isStringSpec(_spec)) && _spec.description) {
        const incorrectDescription = _spec.description as unknown as {
            property: string;
            label: string;
        }[];

        _spec.description = incorrectDescription.reduce(
            (acc: Record<string, string>, {property, label}) => {
                acc[property] = label;

                return acc;
            },
            {},
        );
    }

    if (isObjectSpec(_spec) && _spec.properties) {
        const incorrectProperties = _spec.properties as unknown as {
            key: string;
            property: Record<SpecTypes, Spec>;
        }[];

        _spec.properties = incorrectProperties.reduce(
            (acc: Record<string, Spec>, {key, property}) => {
                if (key && property) {
                    const type = Object.keys(property)[0] as SpecTypes;

                    acc[key] = transformIncorrect({
                        ...property[type],
                        type,
                    } as unknown as Spec);
                }

                return acc;
            },
            {},
        );
    }

    if (isStringSpec(_spec) && _spec.viewSpec.sizeParams?.scale) {
        const incorrectScale = _spec.viewSpec.sizeParams.scale as unknown as {
            type: string;
            factor: string;
            title: string;
        }[];

        _spec.viewSpec.sizeParams.scale = incorrectScale.reduce(
            (acc: Record<string, {factor: string; title: string}>, {type, factor, title}) => {
                acc[type] = {factor, title};

                return acc;
            },
            {},
        );
    }

    if (isStringSpec(_spec) && _spec.viewSpec.selectParams?.meta) {
        const incorrectMeta = _spec.viewSpec.selectParams.meta as unknown as {
            property: string;
            text: string;
        }[];

        _spec.viewSpec.selectParams.meta = incorrectMeta.reduce(
            (acc: Record<string, string>, {property, text}) => {
                acc[property] = text;

                return acc;
            },
            {},
        );
    }

    return _spec;
};

export const getOptionsSpec = (spec: Spec, excludeOptions?: string[]) => {
    let result: ObjectSpec | null = null;

    if (isArraySpec(spec)) {
        result = getArrayOptions();
    }

    if (isBooleanSpec(spec)) {
        result = getBooleanOptions();
    }

    if (isNumberSpec(spec)) {
        result = getNumberOptions();
    }

    if (isObjectSpec(spec)) {
        result = getObjectOptions();
    }

    if (isStringSpec(spec)) {
        result = getStringOptions();
    }

    if (result) {
        if (result.properties?.viewSpec) {
            const viewSpecOrder = (result.properties.viewSpec as ObjectSpec).viewSpec.order?.filter(
                (key) => !excludeOptions?.find((k) => k === `viewSpec.${key}`),
            );

            (result.properties.viewSpec as ObjectSpec).viewSpec.order = viewSpecOrder?.length
                ? viewSpecOrder
                : undefined;
        }

        const order = result.viewSpec.order?.filter(
            (key) => !excludeOptions?.find((k) => k === key),
        );

        result.viewSpec.order = order?.length ? order : undefined;
    }

    return result;
};
