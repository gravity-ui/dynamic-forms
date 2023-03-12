import blockOrigin from 'bem-cn-lite';

const NAMESPACE = 'df-';

export const block = (name: string): ReturnType<typeof blockOrigin> =>
    blockOrigin(`${NAMESPACE}${name}`);
