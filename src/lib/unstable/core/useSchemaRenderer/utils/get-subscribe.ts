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
            const {subscribers} = srState;

            subscribers.byId[id] = subscriber;

            subscriber.schemaPaths?.forEach((schemaPath) => {
                let set = subscribers.byPath.get(schemaPath);

                if (!set) {
                    set = new Set();
                    subscribers.byPath.set(schemaPath, set);
                }

                set.add(id);
            });

            if (subscriber.name) {
                let set = subscribers.byName.get(subscriber.name);

                if (!set) {
                    set = new Set();
                    subscribers.byName.set(subscriber.name, set);
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
            const {subscribers} = srState;
            const subscriber = subscribers.byId[id];

            if (subscriber) {
                subscriber.schemaPaths?.forEach((schemaPath) => {
                    subscribers.byPath.get(schemaPath)?.delete(id);

                    if (subscribers.byPath.get(schemaPath)?.size === 0) {
                        subscribers.byPath.delete(schemaPath);
                    }
                });

                if (subscriber.name) {
                    subscribers.byName.get(subscriber.name)?.delete(id);

                    if (subscribers.byName.get(subscriber.name)?.size === 0) {
                        subscribers.byName.delete(subscriber.name);
                    }
                }

                delete subscribers.byId[id];
            }
        }
    };

    return {subscribe, unsubscribe};
};
