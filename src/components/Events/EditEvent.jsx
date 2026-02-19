import { Link, useNavigate, useParams } from "react-router-dom";

import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchEventId, queryCLient, updateEvent } from "../../utils/http.js";
import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";

export default function EditEvent() {
	const navigate = useNavigate();
	const { id } = useParams();

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["event", id],
		queryFn: ({ signal }) => fetchEventId({ signal, id }),
		enabled: !!id,
	});
	console.log("🚀 ~ EditEvent ~ data:", data);

	const { mutate } = useMutation({
		mutationFn: updateEvent,
		//OPTIMISTIC UPDATE - onMutate will be executed right when you call mutate() -> before getting back a response
		onMutate: async (data) => {
			//to access the data from mutate({ id: id, event: formData }) ;
			const newEvent = data.event;
			// we are making sure that if we had any outgoing queries for the ["event", id] key those queries will be canceled - no clashing
			await queryCLient.cancelQueries({ queryKey: ["event", id] });
			//OPTIMISTIC UPDATE ROLL BACK when the backend failing to make changes
			const previousEvent = queryCLient.getQueryData(["event", id]);
			//Manipulate already stored data witouht waiting for a response
			queryCLient.setQueryData(["event", id], newEvent);
			return {
				previousEvent,
			};
		},
		onError: (error, data, context) => {
			//context can contain that previousEvent
			queryCLient.setQueryData(["event", id], context.previousEvent);
		},
		onSettled: () => {
			//will be called whenever the mutation is done no matter if it is failng or succedeed
			queryCLient.invalidateQueries(["event", id]);
		},
	});

	function handleSubmit(formData) {
		mutate({ id: id, event: formData });
		navigate("../");
	}

	function handleClose() {
		navigate("../");
	}

	let content;

	if (isLoading) {
		content = (
			<div className="center">
				<LoadingIndicator />
			</div>
		);
	}

	if (isError) {
		content = (
			<>
				<ErrorBlock
					title={"Failed to load event"}
					message={error.message || "Failed to load event."}
				/>

				<div className="form-actions">
					<Link className="button" to="../">
						Cancel
					</Link>
				</div>
			</>
		);
	}

	if (data) {
		content = (
			<EventForm inputData={data} onSubmit={handleSubmit}>
				<Link to="../" className="button-text">
					Cancel
				</Link>
				<button type="submit" className="button">
					Update
				</button>
			</EventForm>
		);
	}

	return <Modal onClose={handleClose}>{content}</Modal>;
}
