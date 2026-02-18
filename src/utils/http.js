export async function fetchEvents({ signal, searchTerm }) {
	console.log("🚀 ~ fetchEvents ~ searchTerm:", searchTerm);
	let url = "http://localhost:3000/events";

	if (searchTerm) {
		url += "?search=" + searchTerm;
	}
	const response = await fetch(url, { signal: signal });

	if (!response.ok) {
		const error = new Error("An error occurred while fetching the events");
		error.code = response.status;
		error.info = await response.json();
		throw error;
	}

	const { events } = await response.json();

	return events;
}

export async function createNewEvent(eventData) {
	const response = await fetch("http://localhost:3000/events", {
		method: "POST",
		body: JSON.stringify(eventData),
		headers: {
			"Content-Type": "application/json",
		},
	});

	const data = await response.json();

	if (!response.ok) {
		const error = new Error("An error occured while creating an event");
		error.code = response.status;
		error.info = data;
		throw error;
	}

	return data.event;
}

export async function fetchSelectableImages({ params }) {
	const response = await fetch("http://localhost:3000/events/images", {
		params,
	});
	const { images } = await response.json();

	if (!response.ok) {
		const error = new Error("An error occured while fetching the images");
		error.code = response.status;
		error.info = images;

		throw error;
	}
	return images;
}
