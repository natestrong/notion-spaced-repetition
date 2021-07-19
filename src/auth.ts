import fs from 'fs';
import path from 'path';
import {Client, LogLevel} from '@notionhq/client/build/src';

export interface IConfig {
    repetitions:string[]
    token_path:string
    token:string
}

function spacedRepetitionConfigs():IConfig {
    try {
        const config:IConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'spaced-repetition.json'), 'utf8'));
        config.token = fs.readFileSync(config.token_path, 'utf8');
        return config;
    } catch (err) {
        console.error(err);
    }
}

export const configs = spacedRepetitionConfigs();

export const notion = new Client({
    auth:process.env.NOTION_TOKEN || configs.token,
    logLevel:LogLevel.DEBUG,
});

notion.users.list();
