export const filterTimeArray = (
    times: {id: string; value: string; text: string; content: string | JSX.Element; key: string}[],
    cutoff: string,
    direction: 'greater' | 'less',
) => {
    const isTimeFormat = (value: string) => /^\d{1,2}:\d{2}$/.test(value);

    const compareValues = (a: string, b: string) => {
        if (isTimeFormat(a) && isTimeFormat(b)) {
            return direction === 'greater' ? a > b : a < b;
        } else {
            const aNum = parseInt(a, 10);
            const bNum = parseInt(b, 10);

            return direction === 'greater' ? aNum > bNum : aNum < bNum;
        }
    };

    return times.filter(({value: time}) => compareValues(time, cutoff));
};

export const validateArray = (arr: {value: string}[]) =>
    arr.every((obj) => /^(\d+|\d{1,2}:\d{1,2})$/.test(obj.value));
