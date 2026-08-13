import type {FormApi} from 'final-form';
import {v4 as uuidv4} from 'uuid';

import {getServiceFieldName} from '../../utils';
import {SCHEMA_RENDERER_SERVICE_FIELD} from '../constants';
import type {SchemaRendererState, SchemaRendererSubscriber} from '../types';

export const getSubscribe = (form: FormApi, headName: string) => {
    const srName = getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, headName);

    const subscribe = (subscriber: SchemaRendererSubscriber): string => {
        const id = uuidv4();
        const srField = form.getFieldState(srName);
        const srState: SchemaRendererState | undefined = srField?.data?.state;

        if (srState) {
            const {subsribers} = srState;

            subsribers.byId[id] = subscriber;

            subscriber.schemaPaths?.forEach((schemaPath) => {
                let set = subsribers.byPath.get(schemaPath);

                if (!set) {
                    set = new Set();
                    subsribers.byPath.set(schemaPath, set);
                }

                set.add(id);
            });

            if (subscriber.name) {
                let set = subsribers.byName.get(subscriber.name);

                if (!set) {
                    set = new Set();
                    subsribers.byName.set(subscriber.name, set);
                }

                set.add(id);
            }
        }

        return id;
    };

    const unsubscribe = (id: string) => {
        const srField = form.getFieldState(srName);
        const srState: SchemaRendererState | undefined = srField?.data?.state;

        if (srState) {
            const {subsribers} = srState;
            const subscriber = subsribers.byId[id];

            if (subscriber) {
                subscriber.schemaPaths?.forEach((schemaPath) => {
                    subsribers.byPath.get(schemaPath)?.delete(id);

                    if (subsribers.byPath.get(schemaPath)?.size === 0) {
                        subsribers.byPath.delete(schemaPath);
                    }
                });

                if (subscriber.name) {
                    subsribers.byName.get(subscriber.name)?.delete(id);

                    if (subsribers.byName.get(subscriber.name)?.size === 0) {
                        subsribers.byName.delete(subscriber.name);
                    }
                }

                delete subsribers.byId[id];
            }
        }
    };

    return {subscribe, unsubscribe};
};
