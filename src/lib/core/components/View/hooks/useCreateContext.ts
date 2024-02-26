import React from 'react';

import once from 'lodash/once';

import {DynamicViewContext} from '../types';

const createContext = once(() => React.createContext({} as unknown as DynamicViewContext));

export const useCreateContext = () => createContext();
