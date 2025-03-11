import React from 'react';

import {block} from '../../../../../kit/utils';
import type {Spec} from '../../../../types';
import type {FieldValue} from '../../types';
import {useSearchContext} from '../useSearchContext';

import './useSearch.scss';

const b = block('use-search');

export const useSearch = (spec: Spec, value: FieldValue, name: string) => {
    const {setField, removeField, isHiddenField, searchFunction} = useSearchContext();

    const searchResult = React.useMemo(
        () => !searchFunction(spec, value, name),
        [name, searchFunction, spec, value],
    );

    const hidden = React.useMemo(() => isHiddenField(name), [isHiddenField, name]);

    const withSearch = React.useCallback(
        (children: JSX.Element | null) =>
            children ? <div className={b({hidden: hidden})}>{children}</div> : null,
        [hidden],
    );

    React.useEffect(() => {
        setField(name, searchResult);
    }, [searchResult]);

    React.useEffect(() => {
        return () => removeField(name);
    }, []);

    return withSearch;
};
