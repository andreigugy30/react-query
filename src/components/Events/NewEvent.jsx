import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import { createNewEvent, queryCLient } from "../../utils/http.js";
import ErrorBlock from "../UI/ErrorBlock.jsx";

export default function NewEvent() {
	const navigate = useNavigate();
	//POST request to add new event
	const { mutate, isError, isLoading, error } = useMutation({
		mutationFn: createNewEvent,
		onSuccess: () => {
			queryCLient.invalidateQueries({ queryKey: ["events"] }); //tell React query that data fetched by certain queries is outdated(invalidating)
			navigate("/events");
		}, // will be executed when the mutation is succeded
	});

	function handleSubmit(formData) {
		mutate({ event: formData });
	}

	return (
		<Modal onClose={() => navigate("../")}>
			<EventForm onSubmit={handleSubmit}>
				{isLoading && "Submitting..."}
				{!isLoading && (
					<>
						<Link to="../" className="button-text">
							Cancel
						</Link>
						<button type="submit" className="button">
							Create
						</button>
					</>
				)}
			</EventForm>
			{isError && (
				<ErrorBlock
					title={"Failed to create an event"}
					message={
						error.message?.message || "Please check the inputs and try again"
					}
				/>
			)}
		</Modal>
	);
}
