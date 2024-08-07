export const filterTimeArray = (
    times: {
        id: string;
        content: string;
        value: string;
    }[],
    cutoff: string,
    direction: 'greater' | 'less',
) => {
    if (direction === 'greater') {
        return times.filter(({value: time}) => time > cutoff);
    }

    return times.filter(({value: time}) => time < cutoff);
};
