<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import jsQR from "jsqr";
	import * as yup from "yup";
	import type { Tables } from "#lib/models.js";

	let isLoading = $state(false);
	let error = $state<string | null>(null);
	let ticket = $state<Tables<"event_tickets"> | null>(null);
	let qrResult = $state<string | null>(null);

	let debounceTimeout: ReturnType<typeof setTimeout> | null = null;
	let lastScannedCode: string | null = null;

	let canvasRef: HTMLCanvasElement | undefined;
	let videoRef: HTMLVideoElement | undefined;
	let animationId: number;

	async function startCamera() {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: "environment" },
			});
			if (videoRef) videoRef.srcObject = stream;
		} catch {
			error = "Camera access denied or not available.";
		}
	}

	function handleQRResult(data: string) {
		error = null;
		ticket = null;
		qrResult = data;

		// Ignore empty strings (no QR code detected)
		if (!data || data.trim() === "") return;

		// Validate UUID
		if (!yup.string().uuid().isValidSync(data)) {
			error = `Invalid ticket QR code: '${data}'.`;
			return;
		}

		isLoading = true;
		fetch(`/api/tickets/${data}`)
			.then(async (res) => {
				if (!res.ok) {
					const err = await res.text();
					throw new Error(err);
				}
				return res.json();
			})
			.then((result) => (ticket = result.ticket))
			.catch(
				(err) => (error = "Ticket not found or error: " + err.message),
			)
			.finally(() => (isLoading = false));
	}

	function scanQRCode() {
		if (videoRef && canvasRef) {
			const ctx = canvasRef.getContext("2d");

			if (ctx && videoRef.readyState === videoRef.HAVE_ENOUGH_DATA) {
				canvasRef.width = videoRef.videoWidth;
				canvasRef.height = videoRef.videoHeight;

				ctx.drawImage(
					videoRef,
					0,
					0,
					canvasRef.width,
					canvasRef.height,
				);

				const imageData = ctx.getImageData(
					0,
					0,
					canvasRef.width,
					canvasRef.height,
				);
				const code = jsQR(
					imageData.data,
					canvasRef.width,
					canvasRef.height,
				);

				if (code && code.data !== lastScannedCode) {
					lastScannedCode = code.data;

					// Debounce QR scan
					if (debounceTimeout) {
						clearTimeout(debounceTimeout);
					}

					debounceTimeout = setTimeout(() => {
						handleQRResult(code.data);
					}, 800); // 800ms debounce
				}
			}
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
		qrResult = null;
		ticket = null;
		error = null;
		if (debounceTimeout) clearTimeout(debounceTimeout);
	});
</script>

<div class="grid">
	<section class="s12 m6">
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
		{#if qrResult}<p>Scanned: {qrResult}</p>{/if}
		{#if isLoading}{@render LoadingCard()}{/if}
		{#if error}{@render ErrorCard()}{/if}
		{#if ticket}<pre>{JSON.stringify(ticket, null, 2)}</pre>{/if}
	</section>

	<article class="s12 m6">
		<h2 class="small">Checked in participants</h2>
	</article>
</div>

{#snippet LoadingCard()}
	<article class="tertiary">
		<p>Checking ticket...</p>
	</article>
{/snippet}

{#snippet ErrorCard()}
	<article class="error large-text">
		<i>error</i> <strong>Error:</strong>
		{error}
	</article>
{/snippet}

<style>
	video {
		aspect-ratio: 1;
	}

	canvas {
		display: none;
	}
</style>
