import {EventSource} from 'eventsource'
import { databases } from 'harperdb';

console.log("In extension")

const url = 'https://stream.wikimedia.org/v2/stream/recentchange';
export function start(options = {}) {
    console.log("In start")
    console.log(Object.keys(databases))
    console.log(Object.keys(databases.wiki))
    console.log(Object.keys(databases.wiki.RecentChange))
    const eventSource = new EventSource(url);
    
    eventSource.onopen = () => {
        console.info('Opened connection.');
    };
    eventSource.onerror = (event) => {
        console.error('Encountered error', event);
    };
    eventSource.onmessage = async (event) => {
        // event.data will be a JSON message
        const data = JSON.parse(event.data);
        // discard all canary events
        if (data.meta.domain === 'canary') {
            console.log('received canary event');
            return;
        }

        try {
            logger.info(`Upserting record`);
            await databases.wiki.RecentChange.put(data);
          } catch (error) {
            logger.error(`Could not put the data: ${error.message}`);
          }
    };
}