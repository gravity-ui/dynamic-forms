import React from 'react';

import {block} from '../../../../../kit/utils';
import {Spec} from '../../../../types';
import {FieldValue} from '../../types';
import {useSearchContext} from '../useSearchContext';

import './useSearch.scss';

const b = block('use-search');

export const useSearch = (spec: Spec, value: FieldValue, name: string) => {
    const {setField, removeField, isHiddenField, searchFunction} = useSearchContext();

    const searchResult = React.useMemo(
        () => (searchFunction ? !searchFunction(spec, value, name) : false),
        [name, searchFunction, spec, value],
    );

    const hide = React.useMemo(() => isHiddenField(name), [isHiddenField, name]);

    React.useEffect(() => {
        setField(name, searchResult);
    }, [searchResult]);

    React.useEffect(() => {
        return () => removeField(name);
    }, []);

    const withSearch = React.useCallback(
        (children: JSX.Element | null) => <span className={b({hidden: hide})}>{children}</span>,
        [hide],
    );

    return withSearch;
};
