import {getPageByTitle, notion, notionSearch} from './notion';

export async function generateHome() {
    const homePage = await getPageByTitle('Home');
    // console.log(homePage)

    const todayTasks = await getAllTodayTasks();
}

async function getAllTodayTasks() {
    const today = new Date();
    const pagesDueToday = notion.search({
        filter: {value: 'page', property: 'object'}
    })
}

generateHome()
