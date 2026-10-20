import isObjectLike from 'lodash/isObjectLike';

import {SpecTypes} from '../../constants';

/** @deprecated Use the SchemaRenderer API. */
export const isCorrectViewConfig = (candidate: any) =>
    Object.values(SpecTypes).every(
        (type) =>
            isObjectLike(candidate) &&
            isObjectLike(candidate[type]) &&
            isObjectLike(candidate[type].views) &&
            isObjectLike(candidate[type].layouts),
    );
