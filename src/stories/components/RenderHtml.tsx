import React from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import MarkdownIt from 'markdown-it';

export const RenderHtml = ({text}: {text: string}) => {
    const [html, setHtml] = React.useState('');

    React.useEffect(() => {
        const md = new MarkdownIt({html: true});
        setHtml(md.render(text));
    }, [text]);

    return (
        <React.Fragment>
            {html ? <div dangerouslySetInnerHTML={{__html: html}} /> : null}
        </React.Fragment>
    );
};

export default RenderHtml;
