import { Link, Outlet, useParams, useNavigate } from "react-router-dom";

import Header from "../Header.jsx";
import Modal from "../UI/Modal.jsx";
import { useQuery, useMutation } from "@tanstack/react-query";
import { deleteEvent, fetchEventId, queryCLient } from "../../utils/http.js";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import { useState } from "react";

export default function EventDetails() {
	const [isDeleting, setIsDeleting] = useState(false);
	const { id } = useParams();
	const navigate = useNavigate();
	const { data, isError, isLoading } = useQuery({
		queryKey: ["event", id],
		queryFn: ({ signal }) => fetchEventId({ id, signal }),
		enabled: !!id,
	});

	const {
		mutate,
		isPending: isPendingDeletion,
		isError: isErrorDeleting,
	} = useMutation({
		mutationFn: () => deleteEvent({ id }),
		onSuccess: () => {
			queryCLient.invalidateQueries({
				queryKey: ["events"],
				refetchType: "none",
			});
			navigate("/events");
		},
	});

	const handleStartDelete = () => {
		setIsDeleting(true);
	};

	const handleStopDelete = () => {
		setIsDeleting(false);
	};
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
						<button onClick={handleStartDelete}>Delete</button>
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
			{isDeleting && (
				<Modal onClose={handleStopDelete}>
					<h2>Are you sure</h2>
					<p>Do you really want to delete the event?</p>
					<div className="form-actions">
						{isPendingDeletion && <p>Deleting, please wait...</p>}
						{!isPendingDeletion && (
							<>
								<button onClick={handleStopDelete} className="button-text">
									Cancel
								</button>
								<button onClick={handleDeleteEvent} className="button">
									Delete
								</button>
							</>
						)}
					</div>
					{isErrorDeleting && (
						<ErrorBlock
							title={"Failed to delete event"}
							message={"Faield to delete event.Please try again"}
						/>
					)}
				</Modal>
			)}

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
