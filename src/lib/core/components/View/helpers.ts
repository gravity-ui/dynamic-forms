import _ from 'lodash';

import {SpecTypes} from '../../constants';

export const isCorrectViewConfig = (candidate: any) =>
    Object.values(SpecTypes).every(
        (type) =>
            _.isObjectLike(candidate) &&
            _.isObjectLike(candidate[type]) &&
            _.isObjectLike(candidate[type].views) &&
            _.isObjectLike(candidate[type].layouts),
    );
