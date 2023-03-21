import React from 'react';

import {useCreateSearchContext} from '.';

export const useSearchContext = () => {
    const SearchContext = useCreateSearchContext();
    const context = React.useContext(SearchContext);

    return context;
};
