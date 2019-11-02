// @flow
import {useEffect} from 'react';
import {useCoreContext} from '../core/CoreContext';

export default function useKey(
    keys: Array<string>,
    callback: () => void,
    once?: boolean = false
) {
    const {screen} = useCoreContext();
    const method = once ? 'key' : 'onceKey';
    useEffect(() => {
        screen[method](keys, callback);
        return () => screen.unkey(keys, callback);
    }, [keys]);
}
