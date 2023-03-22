import {Spec} from '../../../types';

export const getParentName = (name: string) => {
    const index = name.lastIndexOf('.');

    if (index !== -1) {
        return name.substring(0, index);
    }

    return undefined;
};

export const getDefaultSearchFunction = (search?: string) => (spec: Spec) => {
    if (search) {
        return Boolean(
            spec.viewSpec.layoutTitle?.toLowerCase().includes(search.trim().toLowerCase()),
        );
    }

    return true;
};
