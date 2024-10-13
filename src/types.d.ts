export interface RelevantEventInfo {
	created: string;
	summary: string;
	start: {
		dateTime: string;
		timeZone: string;
	};
}



export interface CheckForNewEventsResponse {
	newEvent: boolean;
	event?: calendar_v3.Schema$Event;
}