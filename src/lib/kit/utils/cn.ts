import {withNaming} from '@bem-react/classname';

const NAMESPACE = 'df-';

export const cn = withNaming({e: '__', m: '_'});
export const block = withNaming({n: NAMESPACE, e: '__', m: '_'});
