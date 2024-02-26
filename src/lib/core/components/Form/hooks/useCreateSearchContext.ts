import React from 'react';

import once from 'lodash/once';

import {SearchContext} from '../types';

const createContext = once(() => React.createContext({} as unknown as SearchContext));

export const useCreateSearchContext = () => createContext();
