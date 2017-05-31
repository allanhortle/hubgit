import superagent from 'superagent';

export default function Request(query: Object): Promise<any> {
    return new Promise((resolve: Functon, reject: Functon) => {
        superagent
            .post('https://api.github.com/graphql')
            .set('Authorization', `Bearer ${process.env.GITHUB_TOKEN}`)
            .send(query)
            .end((err: any, response: any) => {
                if(!response) {
                    reject(err);
                } else if (response.ok) {
                    resolve(JSON.parse(response.text), response);
                } else {
                    reject(response);
                }
            });
    });
}
