import fs from 'fs';
import path from 'path';
import {Client, LogLevel} from '@notionhq/client/build/src';
import {Database} from '@notionhq/client/build/src/api-types';
import {
    DatabasesQueryResponse,
    DatabasesRetrieveResponse, SearchParameters,
    SearchResponse
} from '@notionhq/client/build/src/api-endpoints';

export const ENV = {
    AUTH:process.env.NOTION_TOKEN
};

export interface IConfig {
    repetitions:string[]
}

function spacedRepetitionConfigs():IConfig {
    try {
        return JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'spaced-repetition.json'), 'utf8'));
    } catch (err) {
        console.error(err);
    }
}

export const configs = spacedRepetitionConfigs();

export const notion = new Client({
    auth:ENV.AUTH
    // logLevel:LogLevel.DEBUG,
});

export const getDbQuery = async (db):Promise<DatabasesQueryResponse> => await notion.databases.query({database_id:db});
export const getDbRetrieve = async (db):Promise<DatabasesRetrieveResponse> => await notion.databases.retrieve({database_id:db});
export const notionSearch = async (searchParams:SearchParameters):Promise<SearchResponse> => await notion.search(searchParams);

export async function getPageByTitle(title:string) {
    const pageQuery = await notionSearch({query:title});

    if (!pageQuery.results.length) {
        throw new Error('Home page not found');
    }

    return pageQuery.results[0];
}

// async function getAllDBsUnderParent(parentDb:string):Promise<string[]> {
//     const parent = await getDb(parentDb);
//     const allDbIds = [parentDb];
//     const stack = parent.results.map(result => result.id);
//     while (stack.length) {
//         const current = stack.pop();
//         allDbIds.push(current);
//         let childResults;
//         try {
//             childResults = await getDb(current);
//         } catch (e) {
//         }
//         console.log(childResults);
//     }
//
//     return allDbIds;
// }
//
// // getAllDBsUnderParent(ENV.PARENT_DB);
//
// // getDbQuery('7e80fc63a4da42e78e44f1e271b063bb');
//
// notionSearch();
