import {I18N} from '@gravity-ui/i18n';

import {Lang, getConfig, subscribeConfigure} from './configure';

import en from './en.json';
import ru from './ru.json';

const KEYSET_NAME = 'dynamic-forms-errors';
const i18n = new I18N();

i18n.setLang(getConfig().lang || Lang.En);

subscribeConfigure((config) => {
    if (config?.lang) {
        i18n.setLang(config.lang);
    }
});

i18n.registerKeyset(Lang.Ru, KEYSET_NAME, ru);
i18n.registerKeyset(Lang.En, KEYSET_NAME, en);

export default i18n.keyset(KEYSET_NAME);
