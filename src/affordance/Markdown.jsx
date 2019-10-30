// @flow
import React  from 'react';

type Props = {
    markdown: string
};

export default function Markdown({markdown}: Props) {
    return <box content={markdown} />;
}

