export const filterTimeArray = (
    times: {
        id: string;
        content: string;
        value: string;
    }[],
    cutoff: string,
    direction: 'greater' | 'less',
) => {
    return times.filter(({value: time}) =>
        direction === 'greater' ? time > cutoff : time < cutoff,
    );
};
