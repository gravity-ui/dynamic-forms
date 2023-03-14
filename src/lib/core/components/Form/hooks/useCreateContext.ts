import React from 'react';

import _ from 'lodash';

import {DynamicFormsContext} from '../types';

const createContext = _.once(() => React.createContext({} as unknown as DynamicFormsContext));

export const useCreateContext = () => createContext();
