import React from 'react';

import _ from 'lodash';

import {SearchContext} from '../types';

const createContext = _.once(() => React.createContext({} as unknown as SearchContext));

export const useCreateSearchContext = () => createContext();
