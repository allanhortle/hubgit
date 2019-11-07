// @flow
import React from 'react';
import {useRef} from 'react';

type Props = {
    label: string,
    onChange: (string) => mixed,
    value: string,
    top?: number
};

type Ref = {value: string};

export default React.memo<Props>(({
    label,
    onChange,
    top
}: Props) => {
    const input = useRef<Ref>({value: ''});
    {/* $FlowFixMe */}
    return <textbox
        ref={input}
        focused
        inputOnFocus
        keys
        mouse
        top={top}
        border="line"
        height={3}
        onKeypress={() => onChange(input.current.value)}
        label={label}
    />;
});

