export const filterTimeArray = (
    times: {id: string; value: string; text: string; content: string | JSX.Element; key: string}[],
    cutoff: string,
    direction: 'greater' | 'less',
) => {
    return times.filter(({value: time}) =>
        direction === 'greater' ? time > cutoff : time < cutoff,
    );
};

export const validateArray = (arr: {value: string}[]) =>
    arr.every((obj) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(obj.value));
