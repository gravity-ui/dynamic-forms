import React from 'react';

import {useCreateSearchContext} from './index';

export const useSearchContext = () => {
    const SearchContext = useCreateSearchContext();
    const context = React.useContext(SearchContext);

    return context;
};
