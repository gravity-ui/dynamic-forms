import React from 'react';

import _ from 'lodash';

import {DynamicViewContext} from '../types';

const createContext = _.once(() => React.createContext({} as unknown as DynamicViewContext));

export const useCreateContext = () => createContext();
