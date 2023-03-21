import {Spec} from '../../../types';

export const searchParentName = (name: string) => {
    const index = name.lastIndexOf('.');
    if (index !== -1) {
        return name.substring(0, index);
    }
    return undefined;
};

export const defaultSearch = (search: string) => (spec: Spec) =>
    spec?.viewSpec.layoutTitle
        ? spec?.viewSpec.layoutTitle.toLowerCase().includes(search.toLowerCase())
        : false;
