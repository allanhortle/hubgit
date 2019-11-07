// @flow
import React from 'react';
import map from 'unmutable/map';
import pipeWith from 'unmutable/pipeWith';
import toArray from 'unmutable/toArray';

type Props = {
    onSubmit: (mixed) => void,
    items: {
        [name: string]: {
            label: string,
            items?: Array<mixed>,
            type: 'textbox'|'textarea'|'radio'|'checkbox'
        }
    }
};


type BlessedNode = {
    value: mixed,
    name: string,
    type: string,
    children: Array<BlessedNode>
};


export default class Form extends React.Component<Props> {
    form: BlessedNode;
    submit: () => void;
    constructor(props: Props) {
        super(props);
        this.form = {};

        this.submit = () => {
            const out = map(({type}) => {
                switch (type) {
                    case 'radio':
                    case 'checkbox':
                        return [];

                    default:
                        return undefined;
                }
            })(props.items);

            const gather = ({name, value, children}) => {
                log(name, value);
                if(value != null) {
                    switch (type) {
                        case 'radio':
                        case 'checkbox':
                            out[name].push(value);
                            break;

                        default:
                            out[name] = value;
                            break;
                    }
                }
                children.forEach(gather);
            };
            this.form.children.forEach(gather);
            this.props.onSubmit(out);
        }
    }

    render() {
        let position = 0;
        return <form
            ref={(ref) => this.form = ref}
            keys
            vi
            focused
            onSubmit={this.submit}
            left="5%"
            top="5%"
            width="90%"
            height="90%"
            border={{type: 'line'}}
            style={{bg: 'cyan', border: {fg: 'blue'}}}
            children={pipeWith(
                this.props.items,
                map(({type, label, items = []}, name, index) => {
                    const childProps = {
                        name,
                        label,
                        keys: true,
                        mouse: true,
                        inputOnFocus: true
                    };
                    const reposition = (Component, props) => {
                        let item = <Component key={name + index} border="line" {...childProps} {...props} top={position} />;
                        position += props.height;
                        return item;
                    };
                    switch (type) {
                        case 'textbox':
                            return reposition(type, {height: 3});

                        case 'textarea':
                            return reposition(type, {height: 7});

                        case 'checkbox':
                        case 'radio': {
                            return reposition('box', {
                                height: items.length + 2,
                                children: items.map((ii, index) => {
                                    return type === 'checkbox'
                                        ? <checkbox key={index} {...childProps} top={index} />
                                        : <radio key={index} {...childProps} top={index} />;
                                })
                            });
                        }


                    }
                }),
                toArray(),
                _ => _.concat(<button key="button" keys vi mouse
                    style={{fg: 'blue', focus: {underline: true}}}
                    height={1} bottom={1} right={1}
                    shrink
                    onPress={this.submit}
                    content="Create Issue"
                />)
            )}
        />;
    }

}
