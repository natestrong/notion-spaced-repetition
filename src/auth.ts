import fs from 'fs';
import path from 'path';
import {Client, LogLevel} from '@notionhq/client/build/src';
import {Database} from '@notionhq/client/build/src/api-types';
import {DatabasesQueryResponse} from '@notionhq/client/build/src/api-endpoints';

const ENV = {
    PARENT_DB:process.env.NOTION_DATABASE_ID,
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

export const getDb = async (db):Promise<DatabasesQueryResponse> => await notion.databases.query({database_id:db});

async function getAllDBsUnderParent(parentDb:string):Promise<string[]> {
    const parent = await getDb(parentDb);
    const allDbIds = [parentDb];
    const stack = parent.results.map(result => result.id);
    while (stack.length) {
        const current = stack.pop();
        allDbIds.push(current);
        let childResults;
        try {
            childResults = await getDb(current);
        } catch (e) {
        }
        console.log(childResults);
    }

    return allDbIds;
}

getAllDBsUnderParent(ENV.PARENT_DB);
