export const isInt = (value: string) => {
    const regex = /^(?:[-+]?(?:0|[1-9]\d*))$/;

    return regex.test(value);
};

export const isFloat = (value: string) => {
    const regex = /^(?:[-+]?(?:\d+))?(?:\.\d*)?(?:[eE][+-]?(?:\d+))?$/;

    return regex.test(value);
};
