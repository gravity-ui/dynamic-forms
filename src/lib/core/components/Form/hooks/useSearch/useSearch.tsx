import React from 'react';

import {FieldValue} from '../..';
import {block} from '../../../../../kit/utils';
import {Spec} from '../../../../types';
import {useSearchContext} from '../useSearchContext';

import './useSearch.scss';

const b = block('search-wrapper');

export const useSearch = (spec: Spec, value: FieldValue, name: string) => {
    const {searchFunction, onChangeStore, onDeleteField, isShowFieldByName} = useSearchContext();

    const searchResult = React.useMemo(
        () => (searchFunction ? searchFunction(spec, value, name) : true),
        [name, searchFunction, spec, value],
    );

    React.useEffect(() => {
        onChangeStore(name, searchResult);
    }, [searchResult]);

    React.useEffect(() => {
        return () => onDeleteField(name);
    }, []);

    const isShow = React.useMemo(() => isShowFieldByName(name), [isShowFieldByName, name]);

    const searchWrapper = React.useCallback(
        (children: JSX.Element | null) => <span className={b({hide: !isShow})}>{children}</span>,
        [isShow],
    );

    return searchWrapper;
};
