export interface RelevantEventInfo {
	created: string;
	summary: string;
	start: string;
	end: string;
}

export interface CheckForNewEventsResponse {
	newEvent: boolean;
	event?: calendar_v3.Schema$Event;
}

export interface CheckForNewEventAndEmailAboutItResponse {
	status: 200 | 500;
	message: string;
}
