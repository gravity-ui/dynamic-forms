import {type FormApi} from 'final-form';

import {getServiceFieldName} from '../../utils';
import {SCHEMA_RENDERER_SERVICE_FIELD} from '../constants';
import type {SchemaRendererEvent, SchemaRendererState} from '../types';

export const getDispatch = (form: FormApi, headName: string) => {
    const srName = getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, headName);

    return (events: SchemaRendererEvent[]) => {
        const srField = form.getFieldState(srName);
        const srState: SchemaRendererState | undefined = srField?.data?.state;

        if (events.length && srState) {
            const {subsribers} = srState;
            const notified = new Set<string>();

            events.forEach((ep) => {
                if (ep.all) {
                    Object.entries(subsribers.byId).forEach(([id, s]) => {
                        if (s.subscription[ep.type] && !notified.has(id)) {
                            notified.add(id);
                            s.callback(events);
                        }
                    });

                    return;
                }

                ep.paths?.forEach((p) => {
                    let current = '';

                    p.forEach((path) => {
                        current = current.length ? `${current}/${path}` : path;

                        subsribers.byPath.get(current)?.forEach((id) => {
                            const s = subsribers.byId[id];

                            if (s.subscription[ep.type] && !notified.has(id)) {
                                notified.add(id);
                                s.callback(events);
                            }
                        });
                    });
                });

                ep.names?.forEach((n) => {
                    subsribers.byName.get(n)?.forEach((id) => {
                        const s = subsribers.byId[id];

                        if (s.subscription[ep.type] && !notified.has(id)) {
                            notified.add(id);
                            s.callback(events);
                        }
                    });
                });
            });
        }
    };
};
