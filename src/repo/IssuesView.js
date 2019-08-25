// @flow
import React, {useEffect, useState} from 'react';
import LoadingBoundary from '../core/LoadingBoundary';
import Api from '../core/EntityApi';
import get from 'unmutable/lib/get';
import getIn from 'unmutable/lib/getIn';
import map from 'unmutable/lib/map';
import sortBy from 'unmutable/lib/sortBy';
import pipeWith from 'unmutable/lib/util/pipeWith';
import pipe from 'unmutable/lib/util/pipe';
import {blue, red, green, magenta, grey, yellow} from '../util/tag';
import ListLayout from '../affordance/ListLayout';
import Title from '../affordance/Title';


export default (props) => {
    return <ListLayout
        request={Api.repo.issues.useRequest}
        payload={props.match.params}
        id={get('number')}
        list={getIn(['repository', 'issues'])}
        listHead={['#', 'Status', 'Name']}
        renderListItem={ii => [
            `${ii.number}`,
            colorState(ii.state),
            ii.title
        ]}
        itemView={PullDescription}
        onSelect={content => {
            const match = content.match(/^(\d*)/) || [];
            return parseInt(match[1], 10);
        }}
    />;
}

function PullDescription({data}) {
    const {state, body, number, author, createdAt, updatedAt, url, comments} = data;
    const description = body || 'No Description';
    const descriptionLines = description.split('\r').length;
    const labels = data.labels.edges
        .map(({node}) => `{#${node.color}-fg}${node.name}{/}`)
        .join(', ');

    return <box mouse scrollable border="bg">
        <listtable top={0} tags align="left" rows={[
            ['state: ', colorState(state)],
            ['number: ', `#${number}`],
            ['opened by: ', yellow(author.login)],
            ['labels: ', labels],
            ['created', `${createdAt}`],
            ['updated', `${updatedAt}`],
            ['url', `${url}`],
        ]}/>
        <Title top={8}>Description</Title>
        <element top={10} height={descriptionLines} content={description} />
        <Title top={11 + descriptionLines}>Comments</Title>
        <table
            align="left"
            top={13 + descriptionLines}
            tags
            rows={comments.edges.map(({node}) => [
                yellow(node.author.login),
                grey(node.createdAt),
                '\n' + (node.body.replace(/^\s+|\s+$/g, ''))
            ])}
        />
    </box>;
}

function colorState(val) {
    switch(val) {
        case 'MERGED':
            return magenta(val);
        case 'CLOSED':
            return red(val);
        case 'OPEN':
            return green(val);
        default:
            return val;
    }
}
