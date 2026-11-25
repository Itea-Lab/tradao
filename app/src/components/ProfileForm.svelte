<script lang="ts">
	import type { Tables } from "#lib/models.js";
	import { updateProfile } from "#lib/remotes/auth.remote.js";
	import { showSnackbar } from "#lib/utils.js";
	import { RemoteFields } from "./remote_fields";

	const { profile, onSuccess }: { profile?: Tables<"profiles">; onSuccess: () => void } =
		$props();

	const { id, displayName } = updateProfile.fields;
</script>

<form
	{...updateProfile.enhance(async (form) => {
		try {
			if (await form.submit()) {
				form.element.reset();
				showSnackbar(`User profile updated`);
				onSuccess();
			} else {
				console.group("User profile update failed");
				form.fields.allIssues()?.forEach((issue) => {
					console.warn(issue.message);
				});
				console.groupEnd();
			}
		} catch (e) {
			console.error(e);
			showSnackbar((e as any).body.message, "error");
		}
	})}
>
	<input {...id.as("text", profile?.id)} readonly hidden />

	<RemoteFields.Text
		id="ff-display-name"
		icon="badge"
		label="Display Name"
		field={displayName}
		defaultValue={profile?.display_name || ""}
	/>

	<div class="medium-space"></div>
	<button type="submit" class="responsive" disabled={!!updateProfile.pending}>
		Update Profile
	</button>
</form>
