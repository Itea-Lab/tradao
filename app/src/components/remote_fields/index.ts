import LocalDatetime from "./LocalDatetime.svelte";
import Major from "./Major.svelte";
import Select from "./Select.svelte";
import Text from "./Text.svelte";

/** BeerCSS form fields to render dynamic questions based on the question type */
export const RemoteFields = {
	/** Date and time question */
	LocalDatetime,

	/** Study major question e.g. Data Science, Software Development */
	Major,

	/** Dropdown select question */
	Select,

	/** Generic text question */
	Text,
}
