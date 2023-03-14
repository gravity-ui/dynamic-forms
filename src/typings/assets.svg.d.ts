declare type SVGIcon = React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

declare module '*.svg' {
    const content: SVGIcon;

    export default content;
}

declare module '*.png' {
    const path: string;

    export default path;
}

declare module '*.jpg' {
    const path: string;

    export default path;
}
