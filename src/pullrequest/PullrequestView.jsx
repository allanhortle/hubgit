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
        request={Api.repo.pulls.useRequest}
        payload={props.match.params}
        id={get('number')}
        list={getIn(['repository', 'pullRequests'])}
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
    const {
        additions,
        author,
        baseRefName,
        body,
        comments,
        createdAt,
        deletions,
        headRefName,
        number,
        reviewThreads,
        state,
        updatedAt,
        url
    } = data;
    const description = body || 'No Description';
    const descriptionLines = description.split('\r').length;

    return <box mouse scrollable border="bg">
        <listtable top={0} tags align="left" rows={[
            ['changes:', `${green('+' + additions)} ${red('-' + deletions)}`],
            ['number: ', `#${number}`],
            ['state:', colorState(state)],
            ['opened by:', yellow(author.login)],
            ['merge:', `${blue(headRefName)} into ${blue(baseRefName)}`],
            ['created:', `${createdAt}`],
            ['updated:', `${updatedAt}`],
            ['url:', `${url}`],
        ]}/>
        <Title top={9}>Description</Title>
        <element top={11} height={descriptionLines} content={description} />
        <Title top={12 + descriptionLines}>Comments</Title>
        <table
            align="left"
            top={14 + descriptionLines}
            tags
            rows={comments.edges.map(({node}) => [
                yellow(node.author.login),
                grey(node.createdAt),
                '\n' + (node.body.replace(/^\s+|\s+$/g, ''))
            ]).concat(...reviewThreads.edges.map(({node}) => [
                ...node.comments.edges.map(({node}) => [
                    yellow(node.author.login),
                    grey(node.createdAt),
                    '\n' + node.body
                ])
            ]))}
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
