import {ENTITY_SERVICE_FIELD} from '../constants';

export const guessHeadName = (registeredFields: string[], name: string) => {
    const registeredServiceFields = registeredFields
        .filter((n) => n.startsWith(ENTITY_SERVICE_FIELD))
        .map((n) => n.slice(`${ENTITY_SERVICE_FIELD}.`.length));

    return registeredServiceFields.find(
        (n) => name === n || name.startsWith(`${n}.`) || name.startsWith(`${n}[`),
    );
};
