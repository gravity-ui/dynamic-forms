import React from 'react';

import {ControllerMirror, WonderMirror} from '../types';

export const useControllerMirror = (
    name: string,
    params: ControllerMirror,
    __mirror?: WonderMirror,
) => {
    if (__mirror?.controller) {
        __mirror.controller[name] = params;
    }

    React.useEffect(() => {
        return () => {
            if (__mirror?.controller?.[name]) {
                delete __mirror.controller[name];
            }
        };
    }, []);
};
