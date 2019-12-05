// @flow
import React from 'react';
import map from 'unmutable/map';
import pipeWith from 'unmutable/pipeWith';
import toArray from 'unmutable/toArray';
import del from 'unmutable/delete';

type Props = {
    onSubmit: (mixed) => void,
    items: {
        [name: string]: {
            label: string,
            options?: Array<mixed>,
            type: 'textbox'|'textarea'|'radio'|'checkbox'
        }
    }
};


type BlessedNode = {
    value: mixed,
    name: string,
    type: string,
    options: {data: mixed},
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

            const gather = ({type, name, value, children, options}) => {
                if(value != null && name !== '__submitButton__') {
                    switch (type) {
                        case 'radio':
                        case 'checkbox':
                            if(value === true) {
                                out[name].push(options.data);
                            }
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
        };
    }

    render() {
        let position = 0;
        return <form
            ref={(ref) => {
                // $FlowFixMe - Silly ref errors not worth fixing
                this.form = ref;
            }}
            keys vi focused tags
            onSubmit={this.submit}
            children={pipeWith(
                this.props.items,
                map(({type, label, options = []}, name, index) => {
                    const childProps = {
                        name,
                        label,
                        left: 1,
                        right: 1,
                        tags: true,
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
                                height: options.length + 2,
                                children: options.map(({value, label}, index) => {
                                    const sansLabel = del('label')(childProps);
                                    return type === 'checkbox'
                                        ? <checkbox key={index} {...sansLabel} top={index} text={label} data={value} />
                                        : <radio key={index} {...sansLabel} top={index} text={label} data={value} />;
                                })
                            });
                        }


                    }
                }),
                toArray(),
                _ => _.concat(<button key="button" keys vi mouse
                    name="__submitButton__"
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
