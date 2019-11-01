// @flow
import React from 'react';


function renderer() {
    let offset = 0;
    let rowIndex = 0;

    return (el, i) => {
        el.shrink = true;
        el.position.left = 0;

        offset += this.children.slice(rowIndex, i).reduce((out, el) => {
            if (!this.isRendered(el)) return out;
            out = Math.max(out, el.lpos.yl - el.lpos.yi);
            return out;
        }, 0);

        rowIndex = i;
        el.position.top = offset;

    };
}

export default function BlockLayout(props: mixed) {
    return <layout width="100%" height="100%" renderer={renderer} {...props} />;
}
