// @flow
import React, {useEffect, useState} from 'react';

export default ({children, top}) => {
    const style = {
        fg: 'black',
        bg: 'white',
    };
    return <box tags top={top} style={style} height={1} content={`{center}${children}{/center}`}/>
}

