import _ from 'lodash';

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
    arrayOptions,
    booleanOptions,
    numberOptions,
    objectOptions,
    stringOptions,
} from './constants';

export const transformCorrect = (spec: Spec) => {
    const _spec = _.cloneDeep(spec);

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

    return _spec;
};

export const transformIncorrect = (spec: Spec) => {
    const _spec = _.cloneDeep(spec);

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

    return _spec;
};

export const getOptionsSpec = (spec: Spec, excludeOptions?: string[]) => {
    let result: ObjectSpec | null = null;

    if (isArraySpec(spec)) {
        result = arrayOptions;
    }

    if (isBooleanSpec(spec)) {
        result = booleanOptions;
    }

    if (isNumberSpec(spec)) {
        result = numberOptions;
    }

    if (isObjectSpec(spec)) {
        result = objectOptions;
    }

    if (isStringSpec(spec)) {
        result = stringOptions;
    }

    if (result) {
        let viewSpec: ObjectSpec | undefined;

        if (result.properties?.viewSpec) {
            viewSpec = result.properties?.viewSpec as ObjectSpec;
            viewSpec.viewSpec = {
                ...viewSpec.viewSpec,
                order: viewSpec.viewSpec.order?.filter(
                    (key) => !excludeOptions?.find((k) => k === `viewSpec.${key}`),
                ),
            };
        }

        result = {
            ...result,
            properties: {
                ...(result.properties || {}),
                ...(viewSpec ? {viewSpec} : {}),
            },
            viewSpec: {
                ...result.viewSpec,
                order: result.viewSpec.order?.filter(
                    (key) => !excludeOptions?.find((k) => k === key),
                ),
            },
        };
    }

    return result;
};
