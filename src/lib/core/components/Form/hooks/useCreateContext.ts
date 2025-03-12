import React from 'react';

import once from 'lodash/once';

import type {DynamicFormsContext} from '../types';

const createContext = once(() => React.createContext({} as unknown as DynamicFormsContext));

export const useCreateContext = () => createContext();
