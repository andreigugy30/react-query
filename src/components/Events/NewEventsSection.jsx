import { useQuery } from "@tanstack/react-query";

import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import EventItem from "./EventItem.jsx";
import { fetchEvents } from "../../utils/http.js";

export default function NewEventsSection() {
	//useQuery -> will send an http request to fetch the recently added events and display them in a list.
	//It will also handle loading and error states.
	const { data, isError, isPending, error } = useQuery({
		// queryFn -> Define the actual code that will send the http request to fetch the recently added events.
		// This function will be called by the useQuery hook when it needs to fetch the data.
		queryFn: fetchEvents,
		// queryKey -> A unique key that identifies this particular query.
		// This is used by React Query to cache the data and manage the state of the query.
		queryKey: ["events"],
		// staleTime -> The amount of time (in milliseconds) that the data fetched by this query will be considered "fresh".
		// During this time, React Query will return the cached data for this query instead of making a new http request.
		// This can improve performance and reduce the number of http requests made to the server.
		// Default is 0 ms, which means that the data will be considered stale immediately after it is fetched.
		staleTime: 5000,
		// garbage collection time -> The amount of time (in milliseconds) that
		// the cached data for this query will be kept in memory before it is garbage collected.
		// This can help to free up memory and prevent memory leaks.Default is 5 minutes (300000 ms).
		// gcTime: 1000,
	});

	//react query caches the data it fetches, so if the same query is made again,
	// it can return the cached data instead of making another http request.
	// This improves performance and reduces the number of http requests made to the server.

	let content;

	if (isPending) {
		content = <LoadingIndicator />;
	}

	if (isError) {
		content = (
			<ErrorBlock
				title="An error occurred"
				message={error.cause?.message || "Failed to fetch events"}
			/>
		);
	}

	if (data) {
		content = (
			<ul className="events-list">
				{data.map((event) => (
					<li key={event.id}>
						<EventItem event={event} />
					</li>
				))}
			</ul>
		);
	}

	return (
		<section className="content-section" id="new-events-section">
			<header>
				<h2>Recently added events</h2>
			</header>
			{content}
		</section>
	);
}
