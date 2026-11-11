<script lang="ts">
	import { login } from "#lib/remotes/auth.remote.js";
	import { issuesText, showSnackbar } from "#lib/utils.js";
	import { goto } from "$app/navigation";
	let { redirectTo }: { redirectTo?: string } = $props();

	let showPassword = $state(false);

	const { email, _password } = login.fields;

	function togglePasswordVisibility() {
		showPassword = !showPassword;
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
				{..._password.as("password")}
				type={showPassword ? "text" : "password"}
				id="password"
				autocomplete="current-password"
				required
			/>
			<label for="password" class="font-bold">Password</label>
			{#if email.issues()}
				<output class="invalid">{issuesText(email.issues())}</output>
			{/if}
		</div>

		<div class="space"></div>

		<div class="grid">
			<button type="submit" class="s9" disabled={!!login.pending}>
				Login
			</button>

			<button
				type="button"
				class="s3 surface-variant round"
				data-testid="password-toggle"
				aria-label={showPassword ? "Hide password" : "Show password"}
				onclick={togglePasswordVisibility}
			>
				<i>{showPassword ? "visibility_off" : "visibility"}</i>
				<span class="tooltip bottom">{showPassword ? "Hide password" : "Show password"}</span>
			</button>
		</div>
	</form>
</article>
