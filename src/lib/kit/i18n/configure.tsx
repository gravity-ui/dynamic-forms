export enum Lang {
    Ru = 'ru',
    En = 'en',
}

interface Config {
    lang?: Lang;
}

type Subscriber = (config: Config) => void;

let config: Config = {};
let subscribers: Subscriber[] = [];

export const configure = (newConfig: Config) => {
    if (newConfig) {
        config = {...config, ...newConfig};
        subscribers.forEach((sub) => sub(config));
    }
};

export const subscribeConfigure = (sub: Subscriber): (() => void) => {
    subscribers.push(sub);

    return () => {
        subscribers = subscribers.filter((el) => el === sub);
    };
};

export const getConfig = () => config;
