import isObjectLike from 'lodash/isObjectLike';

import {SpecTypes} from '../../constants';

export const isCorrectViewConfig = (candidate: any) =>
    Object.values(SpecTypes).every(
        (type) =>
            isObjectLike(candidate) &&
            isObjectLike(candidate[type]) &&
            isObjectLike(candidate[type].views) &&
            isObjectLike(candidate[type].layouts),
    );
