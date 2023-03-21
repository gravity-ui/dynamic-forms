import React from 'react';

import {FieldValue} from '../..';
import {block} from '../../../../../kit/utils';
import {Spec} from '../../../../types';
import {useSearchContext} from '../useSearchContext';

import './useSearch.scss';

const b = block('use-search');

export const useSearch = (spec: Spec, value: FieldValue, name: string) => {
    const {searchFunction, onChangeStore, onDeleteField, isHidden} = useSearchContext();

    const searchResult = React.useMemo(
        () => (searchFunction ? !searchFunction(spec, value, name) : false),
        [name, searchFunction, spec, value],
    );

    React.useEffect(() => {
        onChangeStore(name, searchResult);
    }, [searchResult]);

    React.useEffect(() => {
        return () => onDeleteField(name);
    }, []);

    const hide = React.useMemo(() => isHidden(name), [isHidden, name]);

    const searchWrapper = React.useCallback(
        (children: JSX.Element | null) => <span className={b({hide: hide})}>{children}</span>,
        [hide],
    );

    return searchWrapper;
};
