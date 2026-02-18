import { Link, Outlet, useParams, useNavigate } from "react-router-dom";

import Header from "../Header.jsx";
import { useQuery, useMutation } from "@tanstack/react-query";
import { deleteEvent, fetchEventId, queryCLient } from "../../utils/http.js";
import ErrorBlock from "../UI/ErrorBlock.jsx";

export default function EventDetails() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { data, isError, isLoading, error } = useQuery({
		queryKey: ["event", id],
		queryFn: ({ signal }) => fetchEventId({ id, signal }),
		enabled: !!id,
	});

	const { mutate } = useMutation({
		mutationFn: () => deleteEvent({ id }),
		onSuccess: () => {
			queryCLient.invalidateQueries({
				queryKey: ["events"],
			});
			navigate("/events");
		},
	});

	const handleDeleteEvent = () => {
		mutate();
	};

	let content = "";

	if (isLoading) {
		content = (
			<div className="center" id="event-details-content">
				<p>Loading for the event...</p>
			</div>
		);
	}

	if (isError) {
		content = (
			<div className="center" id="event-details-content">
				<ErrorBlock title={"Failed to load event"} message={"error on event"} />
			</div>
		);
	}
	if (data) {
		content = (
			<>
				<header>
					<h1>{data?.title}</h1>
					<nav>
						<button onClick={handleDeleteEvent}>Delete</button>
						<Link to="edit">Edit</Link>
					</nav>
				</header>
				<div id="event-details-content">
					<img src={`http://localhost:3000/${data.image}`} alt="" />
					<div id="event-details-info">
						<div>
							<p id="event-details-location">{data.location}</p>
							<time dateTime={`Todo-DateT$Todo-Time`}>
								{data.date} {data.time}
							</time>
						</div>
						<p id="event-details-description">{data.description}</p>
					</div>
				</div>
			</>
		);
	}
	return (
		<>
			<Outlet />
			<Header>
				<Link to="/events" className="nav-item">
					View all Events
				</Link>
			</Header>
			<article id="event-details">{content}</article>
		</>
	);
}
