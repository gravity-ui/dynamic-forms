import {withNaming} from '@bem-react/classname';

const NAMESPACE = 'df-';

/** @deprecated Use the SchemaRenderer API. */
export const cn = withNaming({e: '__', m: '_'});
/** @deprecated Use the SchemaRenderer API. */
export const block = withNaming({n: NAMESPACE, e: '__', m: '_'});
