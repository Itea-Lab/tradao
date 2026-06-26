<script lang="ts">
	const {
		title,
		description,
		keywords,
		image,
	}: {
		title: string;
		description?: string | null;
		keywords?: string | null;
		image?: string | null;
	} = $props();
</script>

<svelte:head>
	<title>{title} | Tradao by ITea Lab&trade;</title>

	<meta name="application-name" content="Tradao" />
	<meta name="author" content="ITea Lab" />
	{#if description}<meta name="description" content={description} />{/if}
	{#if keywords}<meta name="keywords" content={keywords} />{/if}

	<!-- Open Graph -->
	<!-- https://stackoverflow.com/questions/8569892/how-to-test-open-graph-on-localhost -->
	<meta property="og:title" content={title} />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content="en_VN" />
	<meta property="og:site_name" content="Tradao by ITea Lab&trade;" />
	{#if description}<meta property="og:description" content={description} />{/if}
	{#if image}<meta property="og:image" content={image} />{/if}

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@itealab" />
	<meta name="twitter:image" content={image} />
	<meta name="twitter:creator" content="@TuritoYuenan" />
	<meta name="twitter:description" content={description} />
</svelte:head>
