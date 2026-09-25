import { Row, Column, Img, Font, Head } from "react-email";

export interface EventData {
	category: string;
	created_at: string;
	description: string | null;
	end_time: string;
	id: string;
	image: string;
	location: string | null;
	organiser_id: string;
	start_time: string;
	title: string;
	updated_at: string;
}

export const colours = {
	/** Accent color */ ac: "#a8cd89",
	/** AccentDark color */ ad: "#103228",
	/** Foreground color */ fg: "#153448",
	/** Background color */ bg: "#e6fff2",
}

/**
 * Email document head
 */
export const EmailHead = (props: { subject: string }) => (
	<Head>
		<title>{props.subject}</title>
		<Font
			fallbackFontFamily={["Arial", "sans-serif"]}
			fontFamily="Roboto"
			webFont={{
				url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
				format: "woff2",
			}} />
	</Head>
);

/**
 * Email header with logos
 */
export const LogoHeader = () => (
	<Row className={`w-auto mx-auto mt-[1rem] p-[1rem] rounded-lg`}>
		<Column align="right">
			<Img
				width={129.25} height={64} alt="ITea Lab Logo"
				src="https://tradao.turitoyuenan.workers.dev/logos/logo-lab.png"
			/>
		</Column>

		{/* Email-safe spacer */}
		<Column className={`text-6xl px-[1rem] text-[${colours.fg}]`}>&times;</Column>

		<Column align="left">
			<Img
				width={201.75} height={64} alt="Tradao Logo"
				src="https://tradao.turitoyuenan.workers.dev/logos/logo.png"
			/>
		</Column>
	</Row>
);
