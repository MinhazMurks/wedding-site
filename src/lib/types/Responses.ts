export type GetRsvpResponse = {
	firstName: string,
	lastName: string,
	plusOneEnabled: boolean,
}

export type GetAllPlacesResponse = {
	places: PlaceData[]
}

export type PlaceData = {
	name: string,
	address: string,
	cost: string | null,
	distanceFromVenue: number | null,
	distanceFromAirport: number | null,
	website: string | null,
	phoneNumber: string | null,
	category: PlaceCategory,
}

export enum PlaceCategory {
	LODGING = "LODGING",
	RESTAURANT = "RESTAURANT",
	ENTERTAINMENT = "ENTERTAINMENT",
	NIGHTLIFE = "NIGHTLIFE",
	CAR_RENTAL = "CAR_RENTAL",
}