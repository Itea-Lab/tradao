<script lang="ts">
	let { redirectTo }: { redirectTo?: string } = $props();

	let showPassword = $state(false);
	let isSubmitting = $state(false);
	let errors = $state<string[]>([]);

	function togglePasswordVisibility() {
		showPassword = !showPassword;
	}

	function handlePasswordToggleKeydown(event: KeyboardEvent) {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			togglePasswordVisibility();
		}
	}

	async function handleLogin(e: Event) {
		isSubmitting = true;
		e.preventDefault();
		const form = e.target as HTMLFormElement;
		const data = Object.fromEntries(new FormData(form).entries());

		const response = await fetch("/api/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ ...data, redirectTo }),
		});

		switch (response.status) {
			case 400: {
				// 4xx errors
				const data = await response.json();
				errors = data.errors;
				isSubmitting = false;
				break;
			}

			case 500: {
				// 5xx errors
				errors = [
					"Something went wrong on our end. Please try again later.",
				];
				isSubmitting = false;
				break;
			}

			case 200: {
				// Success - redirecting
				const data = await response.json();
				const redirectUrl = data.redirectTo || "/manage";
				window.location.href = redirectUrl;
				break;
			}

			default: {
				// Unexpected status code
				errors = ["Unexpected error. Please try again later."];
			}
		}
	}
</script>

<article style="max-width: 80ch; margin-inline: auto">
	<form method="POST" onsubmit={handleLogin} novalidate>
		<div class="field border label prefix">
			<i>email</i>
			<input type="email" name="email" id="email" required />
			<label for="email" class="font-bold">Email address</label>
		</div>

		<div class="field border label prefix suffix">
			<i>lock</i>
			<input
				type={showPassword ? "text" : "password"}
				name="password"
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
			>{showPassword ? "visibility_off" : "visibility"}</i>
		</div>

		<div class="medium-space"></div>

		{#if errors.length > 0}
			<div class="error">
				{#each errors as error}
					<p>{error}</p>
				{/each}
			</div>
		{/if}

		<button type="submit" class="responsive" disabled={isSubmitting}>
			Login
		</button>
	</form>
</article>
