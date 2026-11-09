const discardRightZeros = (num: string): string => {
    return !num || num[num.length - 1] !== '0' ? num : discardRightZeros(num.slice(0, -1));
};

// only positive degree
const mathPow = (degree: number): bigint => {
    const factor = BigInt(10);
    let cnt = degree;
    let result = BigInt(1);

    while (cnt-- > 0) {
        result = result * factor;
    }

    return result;
};

export const multiply = (a: string, b: string, afterDotLength?: number) => {
    try {
        const [aBefore, aAfter = ''] = a.split('.');
        const [bBefore, bAfter = ''] = b.split('.');

        const digitCapacityDegree = aAfter.length + bAfter.length;
        const digitCapacity = mathPow(aAfter.length + bAfter.length);
        const multiplied = BigInt(`${aBefore}${aAfter}`) * BigInt(`${bBefore}${bAfter}`);

        const integerPart = multiplied / digitCapacity;
        const fractionalPart = multiplied % digitCapacity;
        const fractionalPartZeros =
            digitCapacityDegree > 0
                ? '0'.repeat(digitCapacityDegree - String(fractionalPart || '').length)
                : '';
        const stringFractionalPart = fractionalPartZeros + fractionalPart;
        const slicedFractionalPart = discardRightZeros(
            stringFractionalPart.slice(0, afterDotLength),
        );

        return `${integerPart}${BigInt(slicedFractionalPart) ? `.${slicedFractionalPart}` : ''}`;
    } catch {
        return null;
    }
};

export const divide = (a: string, b: string, afterDotLength?: number) => {
    try {
        const [aBefore, aAfter = ''] = a.split('.');
        const [bBefore, bAfter = ''] = b.split('.');

        const MIN_RESERVE = 20;
        const reserve =
            (afterDotLength && afterDotLength > MIN_RESERVE ? afterDotLength : MIN_RESERVE) +
            b.length;

        const digitCapacityDegree = reserve + aAfter.length - bAfter.length;
        const digitCapacity = mathPow(digitCapacityDegree);
        const divided =
            (BigInt(`${aBefore}${aAfter}`) * mathPow(reserve)) / BigInt(`${bBefore}${bAfter}`);

        const integerPart = divided / digitCapacity;
        const fractionalPart = divided % digitCapacity;
        const fractionalPartZeros =
            digitCapacityDegree > 0
                ? '0'.repeat(digitCapacityDegree - String(fractionalPart || '').length)
                : '';
        const stringFractionalPart = fractionalPartZeros + fractionalPart;
        const slicedFractionalPart = discardRightZeros(
            stringFractionalPart.slice(0, afterDotLength),
        );

        return `${integerPart}${BigInt(slicedFractionalPart) ? `.${slicedFractionalPart}` : ''}`;
    } catch {
        return null;
    }
};
