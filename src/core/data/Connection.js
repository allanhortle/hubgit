// @flow
export type ConnectionShape<A> = {
    +edges: Array<{+node: A}>,
    +nodes: Array<A>,
    +pageInfo: {
        +endCursor: string,
        +hasNextPage: boolean,
        +hasPreviousPage: boolean,
        +startCursor: string
    },
    +totalCount: number
};

