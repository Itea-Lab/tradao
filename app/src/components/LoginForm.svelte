<script lang="ts">
	import { login } from "#lib/remotes/auth.remote.js";
	import { showSnackbar } from "#lib/snackbar.js";
	import { issuesText } from "#lib/utils.js";
	import { goto } from "$app/navigation";
	let { redirectTo }: { redirectTo?: string } = $props();

	let showPassword = $state(false);

	const { email, _password, allIssues } = login.fields;

	function togglePasswordVisibility() {
		showPassword = !showPassword;
	}

	function handlePasswordToggleKeydown(event: KeyboardEvent) {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			togglePasswordVisibility();
		}
	}
</script>

<article style="max-width: 80ch; margin-inline: auto">
	<form
		{...login.enhance(async (form) => {
			try {
				if (await form.submit()) {
					if (!form.result?.success) throw new Error(form.result?.message);
					form.element.reset();
					showSnackbar(form.result.message);
					goto(redirectTo || "/organisers");
				}
			} catch (e) {
				console.error(e);
				showSnackbar(e as string, "error");
			}
		})}
	>
		<div class={["field border label prefix"]}>
			<i>email</i>
			<input {...email.as("email")} />
			<label for="email" class="font-bold">Email address</label>
		</div>

		<div class="field border label prefix suffix">
			<i>lock</i>
			<input
				{..._password.as(showPassword ? "text" : "password")}
				id="password"
				autocomplete="current-password"
				required
			/>
			<label for="password" class="font-bold">Password</label>
			<i
				class="front"
				role="button"
				tabindex="0"
				aria-label={showPassword ? "Hide password" : "Show password"}
				onclick={togglePasswordVisibility}
				onkeydown={handlePasswordToggleKeydown}
				>{showPassword ? "visibility_off" : "visibility"}</i
			>
			{#if email.issues()}
				<output class="invalid">{issuesText(email.issues())}</output>
			{/if}
		</div>

		<div class="space"></div>

		<button type="submit" class="responsive" disabled={!!login.pending}>Login</button>
	</form>
</article>
