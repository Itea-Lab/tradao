<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import jsQR from "jsqr";
	import { getTicket } from "#lib/remotes/tickets.remote.js";
	import type { Tables } from "#lib/models.js";

	let isLoading = $state(false);
	let error = $state<string | null>(null);
	let ticket = $state<Tables<"event_tickets"> | null>(null);
	const tickets = $state<Tables<"event_tickets">[]>([]);

	let debounceTimeout: ReturnType<typeof setTimeout> | null = null;
	let lastScannedCode: string | null = null;

	let canvasRef: HTMLCanvasElement | undefined;
	let videoRef: HTMLVideoElement | undefined;
	let animationId: number;

	async function startCamera() {
		await navigator.mediaDevices
			.getUserMedia({ video: { facingMode: "environment" } })
			.then((stream) => {
				if (videoRef) videoRef.srcObject = stream;
			})
			.catch(() => (error = "Camera access denied or not available."));
	}

	function handleQRResult(data: string) {
		error = null;
		ticket = null;

		// Ignore empty strings (no QR code detected)
		if (!data || data.trim() === "") return;

		isLoading = true;
		getTicket(data)
			.then((result) => {
				ticket = result;
				tickets.push(result);
			})
			.catch((e) => (error = e.body.message))
			.finally(() => (isLoading = false));
	}

	function scanQRCode() {
		if (!videoRef || !canvasRef) return;

		const ctx = canvasRef.getContext("2d");

		if (!ctx || videoRef.readyState !== videoRef.HAVE_ENOUGH_DATA) return;

		canvasRef.width = videoRef.videoWidth;
		canvasRef.height = videoRef.videoHeight;

		ctx.drawImage(videoRef, 0, 0, canvasRef.width, canvasRef.height);

		const imageData = ctx.getImageData(0, 0, canvasRef.width, canvasRef.height);
		const code = jsQR(imageData.data, canvasRef.width, canvasRef.height);

		if (code && code.data !== lastScannedCode) {
			lastScannedCode = code.data;

			// Debounce QR scan
			if (debounceTimeout) clearTimeout(debounceTimeout);

			debounceTimeout = setTimeout(() => {
				handleQRResult(code.data);
			}, 800);
		}
	}

	function isCameraSupported() {
		return (
			typeof window !== "undefined" &&
			navigator.mediaDevices &&
			"getUserMedia" in navigator.mediaDevices
		);
	}

	onMount(() => {
		if (isCameraSupported()) {
			startCamera();
			animationId = requestAnimationFrame(function scan() {
				scanQRCode();
				animationId = requestAnimationFrame(scan);
			});
		} else {
			error = "Camera not supported in this environment.";
		}
	});

	onDestroy(() => {
		if (animationId) {
			cancelAnimationFrame(animationId);
		}
		if (videoRef && videoRef.srcObject) {
			const tracks = (videoRef.srcObject as MediaStream).getTracks();
			tracks.forEach((track) => track.stop());
		}
		ticket = null;
		error = null;
		if (debounceTimeout) clearTimeout(debounceTimeout);
	});
</script>

<div class="grid">
	<section class="s12 m6">
		<article class={[isLoading && "tertiary", ticket && "success", error && "error"]}>
			<i>info</i>
			{#if isLoading}
				<span>Checking ticket...</span>
			{:else if ticket}
				<span>Ticket found: {ticket.name}</span>
			{:else if error}
				<span>Error: {error}</span>
			{:else}
				<span>Scan a QR code to check in a participant.</span>
			{/if}
		</article>

		<article class="no-padding">
			<video
				bind:this={videoRef}
				autoplay
				playsinline
				aria-label="Camera feed"
				class="responsive"
			></video>
			<canvas bind:this={canvasRef}></canvas>
		</article>
	</section>

	<article class="s12 m6">
		<h2 class="small">Checked in participants</h2>
	</article>
</div>

<style>
	video {
		aspect-ratio: 1;
	}

	canvas {
		display: none;
	}
</style>
