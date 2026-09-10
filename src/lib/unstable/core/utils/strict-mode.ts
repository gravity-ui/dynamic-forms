export const getStrictModeChecker = () => {
    const checker: {
        cachedValues: Record<string, unknown> | undefined;
        hasDiff: boolean | undefined;
        check: (currentValues: Record<string, unknown>) => boolean;
        isStrict: () => boolean | undefined;
    } = {
        cachedValues: undefined,
        hasDiff: undefined,
        check: (currentValues: Record<string, unknown>) => {
            const cachedValues = checker.cachedValues;

            if (
                !cachedValues ||
                [...Object.keys(cachedValues), ...Object.keys(currentValues)].some(
                    (key) => cachedValues[key] !== currentValues[key],
                )
            ) {
                checker.cachedValues = {...currentValues};
                checker.hasDiff = true;

                return true;
            }

            return false;
        },
        isStrict: () => {
            if (checker.hasDiff === undefined) {
                return undefined;
            }

            const hasDiff = checker.hasDiff;

            checker.hasDiff = undefined;

            return !hasDiff;
        },
    };

    return checker;
};
