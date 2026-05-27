import type {StringSpec} from 'src/lib/core';

import {divide, multiply} from '../utils';

export const isInt = (value: string) => {
    const regex = /^(?:[-+]?(?:0|[1-9]\d*))$/;

    return regex.test(value);
};

export const isFloat = (value: string) => {
    const regex = /^(?:[-+]?(?:\d+))?(?:\.\d*)?(?:[eE][+-]?(?:\d+))?$/;

    return regex.test(value);
};

/**
 * Scales value given in defaultFactor to scaleFactor
 * @param value
 * @param scaleFactor
 * @param defaultFactor
 * @returns value in scaleFactor
 */
const scaleValue = (value: number, scaleFactor: string, defaultFactor: string): string | null => {
    if (defaultFactor === scaleFactor) {
        return String(value);
    }

    const valueStr = String(value);

    try {
        if (BigInt(scaleFactor) > BigInt(defaultFactor)) {
            const ratio = divide(scaleFactor, defaultFactor);
            return ratio ? divide(valueStr, ratio, 6) : null;
        }

        const ratio = divide(defaultFactor, scaleFactor);
        return ratio ? multiply(valueStr, ratio, 6) : null;
    } catch {
        return null;
    }
};

/**
 * Checks if the number is > 1
 * @param numStr - number in a string form
 * @returns true if the number is > 1, false otherwise
 */
const isReadable = (numStr: string | null): boolean => {
    if (numStr === null) {
        return false;
    }

    // Math.abs does not support BigInt
    const intPart = numStr.split('.')[0].replace('-', '');

    try {
        return BigInt(intPart) >= BigInt(1);
    } catch {
        return false;
    }
};

/**
 * Returns the biggest readable scale for the given limit
 * @param sizeParams - sizeParams of NumberWithScale
 * @param value - value in defaultFactor scale, which is referenced to deduce appropriate scale
 * @returns the biggest readable scale for the given limit
 */
const getMostAppropriateScale = (
    sizeParams: NonNullable<StringSpec['viewSpec']['sizeParams']>,
    value: number,
): string => {
    const {defaultType, scale} = sizeParams;

    const valueStr = String(value);

    const defaultFactor = scale[defaultType].factor;
    let bestType = defaultType;

    Object.keys(scale).forEach((key) => {
        if (BigInt(scale[key].factor) > BigInt(scale[bestType].factor)) {
            const ratio = divide(scale[key].factor, defaultFactor);

            if (!ratio) {
                return;
            }

            if (!isReadable(divide(valueStr, ratio, 2))) {
                return;
            }

            bestType = key;
        }
    });

    return bestType;
};

export const getScaledLimit = (
    spec: StringSpec,
    limit: number,
): {count: string; scaleTitle: string} | undefined => {
    const sizeParams = spec.viewSpec?.sizeParams;

    if (!sizeParams) {
        return undefined;
    }

    const mostAppropriateScale = getMostAppropriateScale(sizeParams, limit);
    const scaleEntry = sizeParams.scale[mostAppropriateScale];
    const defaultEntry = sizeParams.scale[sizeParams.defaultType];

    if (!scaleEntry || !defaultEntry) {
        return undefined;
    }

    const count = scaleValue(limit, scaleEntry.factor, defaultEntry.factor);

    if (count === null) {
        return undefined;
    }

    return {count, scaleTitle: scaleEntry.title};
};
