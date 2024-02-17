export class Movie {
	year: number;
	title: string;
	info: Info;
	savedTimeStamp: number;
	status: Status;
	constructor(year: number, title: string, info: Info) {
		this.year = year;
		this.title = title;
		this.info = info;
		this.savedTimeStamp = new Date().getTime()
		this.status = Status.ACTIVE;
	}
}
export enum Status {
	ACTIVE, INACTIVE
}
export class Info {
	plot: string;
	rating: number;
	actors?: string[] = undefined;

	constructor(plot: string, rating: number, actors?: string[]) {
		this.plot = plot;
		this.rating = rating;
		this.actors = actors;
	}
}
