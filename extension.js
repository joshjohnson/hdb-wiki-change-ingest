import {EventSource} from 'eventsource'
import { databases } from 'harperdb';

const url = 'https://stream.wikimedia.org/v2/stream/recentchange';
export function startOnMainThread(options = {}) {
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
            awaitdatabases.Wiki.RecentChange.put(data);
          } catch (error) {
            logger.error(`Could not put the data: ${error.message}`);
          }
    };
}