import type {SchemaRendererEventType} from '../../constants';

export interface SchemaRendererSubscriber {
    callback: (events: SchemaRendererEvent[]) => void;
    name?: string;
    schemaPaths?: string[];
    subscription: Partial<Record<SchemaRendererEventType, boolean>>;
}

export interface SchemaRendererEvent {
    type: SchemaRendererEventType;
    all?: boolean;
    names?: string[];
    paths?: string[][];
}
