import {Spec} from '../../../types';

export const defaultSearch = (search: string) => (spec: Spec) =>
    spec?.viewSpec.layoutTitle
        ? spec?.viewSpec.layoutTitle.toLowerCase().includes(search.toLowerCase())
        : false;
