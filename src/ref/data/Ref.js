// @flow
type RefShape = {
    name: string,
    prefix: string
};

export default class Ref {
    _data: RefShape;
    constructor(data: RefShape = {}) {
        this._data = data;
    }
    static fromQualifiedName(str: string): Ref {
        const [,prefix, name] = str.match(/(.*?\/.*?\/)(.*)/);
        return new Ref({name, prefix});
    }

    // getters
    get name() {
        return this._data.name;
    }
    get prefix() {
        return this._data.prefix;
    }
	get qualifiedName() {
		const {name, prefix} = this._data;
		return prefix + name;
	}
}
