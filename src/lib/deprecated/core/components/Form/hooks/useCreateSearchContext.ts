import React from 'react';

import once from 'lodash/once';

import type {SearchContext} from '../types';

const createContext = once(() => React.createContext({} as unknown as SearchContext));

export const useCreateSearchContext = () => createContext();
