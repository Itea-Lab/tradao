export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type Database = {
	// Allows to automatically instantiate createClient with right options
	// instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
	__InternalSupabase: {
		PostgrestVersion: "14.18";
	};
	graphql_public: {
		Tables: {
			[_ in never]: never;
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			graphql: {
				Args: {
					extensions?: Json;
					operationName?: string;
					query?: string;
					variables?: Json;
				};
				Returns: Json;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	public: {
		Tables: {
			academic_status: {
				Row: {
					description: string | null;
					id: string;
					label: string;
				};
				Insert: {
					description?: string | null;
					id: string;
					label: string;
				};
				Update: {
					description?: string | null;
					id?: string;
					label?: string;
				};
				Relationships: [];
			};
			community_events: {
				Row: {
					category: string;
					created_at: string;
					description: string | null;
					end_time: string;
					id: string;
					image: string;
					location: string | null;
					organiser_id: string;
					slug: string | null;
					start_time: string;
					title: string;
					updated_at: string;
				};
				Insert: {
					category?: string;
					created_at?: string;
					description?: string | null;
					end_time: string;
					id?: string;
					image?: string;
					location?: string | null;
					organiser_id: string;
					slug?: string | null;
					start_time: string;
					title: string;
					updated_at?: string;
				};
				Update: {
					category?: string;
					created_at?: string;
					description?: string | null;
					end_time?: string;
					id?: string;
					image?: string;
					location?: string | null;
					organiser_id?: string;
					slug?: string | null;
					start_time?: string;
					title?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "community_events_organiser_id_fkey";
						columns: ["organiser_id"];
						isOneToOne: false;
						referencedRelation: "event_organisers";
						referencedColumns: ["id"];
					},
				];
			};
			event_organisers: {
				Row: {
					contact_email: string;
					created_at: string;
					description: string | null;
					id: string;
					name: string;
					updated_at: string;
				};
				Insert: {
					contact_email: string;
					created_at?: string;
					description?: string | null;
					id?: string;
					name: string;
					updated_at?: string;
				};
				Update: {
					contact_email?: string;
					created_at?: string;
					description?: string | null;
					id?: string;
					name?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			event_tickets: {
				Row: {
					created_at: string;
					email: string;
					event_id: string;
					id: string;
					name: string;
					updated_at: string;
				};
				Insert: {
					created_at?: string;
					email: string;
					event_id: string;
					id?: string;
					name: string;
					updated_at?: string;
				};
				Update: {
					created_at?: string;
					email?: string;
					event_id?: string;
					id?: string;
					name?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "event_tickets_event_id_fkey";
						columns: ["event_id"];
						isOneToOne: false;
						referencedRelation: "community_events";
						referencedColumns: ["id"];
					},
				];
			};
			fields_of_study: {
				Row: {
					description: string | null;
					id: string;
					label: string;
				};
				Insert: {
					description?: string | null;
					id: string;
					label: string;
				};
				Update: {
					description?: string | null;
					id?: string;
					label?: string;
				};
				Relationships: [];
			};
			question_types: {
				Row: {
					description: string | null;
					slug: string;
				};
				Insert: {
					description?: string | null;
					slug: string;
				};
				Update: {
					description?: string | null;
					slug?: string;
				};
				Relationships: [];
			};
			registration_answers: {
				Row: {
					answer_text: string | null;
					created_at: string;
					id: string;
					question_id: string;
					ticket_id: string;
					updated_at: string;
				};
				Insert: {
					answer_text?: string | null;
					created_at?: string;
					id?: string;
					question_id: string;
					ticket_id: string;
					updated_at?: string;
				};
				Update: {
					answer_text?: string | null;
					created_at?: string;
					id?: string;
					question_id?: string;
					ticket_id?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "registration_answers_question_id_fkey";
						columns: ["question_id"];
						isOneToOne: false;
						referencedRelation: "registration_questions";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "registration_answers_ticket_id_fkey";
						columns: ["ticket_id"];
						isOneToOne: false;
						referencedRelation: "event_tickets";
						referencedColumns: ["id"];
					},
				];
			};
			registration_questions: {
				Row: {
					created_at: string;
					event_id: string;
					id: string;
					is_required: boolean | null;
					question_text: string;
					question_type: string;
					updated_at: string;
				};
				Insert: {
					created_at?: string;
					event_id: string;
					id?: string;
					is_required?: boolean | null;
					question_text: string;
					question_type: string;
					updated_at?: string;
				};
				Update: {
					created_at?: string;
					event_id?: string;
					id?: string;
					is_required?: boolean | null;
					question_text?: string;
					question_type?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "registration_questions_event_id_fkey";
						columns: ["event_id"];
						isOneToOne: false;
						referencedRelation: "community_events";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName:
							"registration_questions_question_type_fkey";
						columns: ["question_type"];
						isOneToOne: false;
						referencedRelation: "question_types";
						referencedColumns: ["slug"];
					},
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			academic_year:
				| "Freshman"
				| "Sophomore"
				| "Junior"
				| "Senior"
				| "Graduate"
				| "Other";
			field_of_study:
				| "Business"
				| "Computer Science"
				| "Media & Communication";
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema =
	DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends (DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	} ? keyof (
			& DatabaseWithoutInternals[
				DefaultSchemaTableNameOrOptions["schema"]
			]["Tables"]
			& DatabaseWithoutInternals[
				DefaultSchemaTableNameOrOptions["schema"]
			]["Views"]
		)
		: never) = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
} ? (
		& DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]][
			"Tables"
		]
		& DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]][
			"Views"
		]
	)[TableName] extends {
		Row: infer R;
	} ? R
	: never
	: DefaultSchemaTableNameOrOptions extends keyof (
		& DefaultSchema["Tables"]
		& DefaultSchema["Views"]
	) ? (
			& DefaultSchema["Tables"]
			& DefaultSchema["Views"]
		)[DefaultSchemaTableNameOrOptions] extends {
			Row: infer R;
		} ? R
		: never
	: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends (DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[
			DefaultSchemaTableNameOrOptions["schema"]
		]["Tables"]
		: never) = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]][
		"Tables"
	][TableName] extends {
		Insert: infer I;
	} ? I
	: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
			Insert: infer I;
		} ? I
		: never
	: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends (DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[
			DefaultSchemaTableNameOrOptions["schema"]
		]["Tables"]
		: never) = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]][
		"Tables"
	][TableName] extends {
		Update: infer U;
	} ? U
	: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
			Update: infer U;
		} ? U
		: never
	: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends
		| keyof DefaultSchema["Enums"]
		| { schema: keyof DatabaseWithoutInternals },
	EnumName extends (DefaultSchemaEnumNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[
			DefaultSchemaEnumNameOrOptions["schema"]
		]["Enums"]
		: never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]][
		"Enums"
	][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
		? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
	: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema["CompositeTypes"]
		| { schema: keyof DatabaseWithoutInternals },
	CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[
			PublicCompositeTypeNameOrOptions["schema"]
		]["CompositeTypes"]
		: never) = never,
> = PublicCompositeTypeNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]][
		"CompositeTypes"
	][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends
		keyof DefaultSchema["CompositeTypes"]
		? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
	: never;

export const Constants = {
	graphql_public: {
		Enums: {},
	},
	public: {
		Enums: {
			academic_year: [
				"Freshman",
				"Sophomore",
				"Junior",
				"Senior",
				"Graduate",
				"Other",
			],
			field_of_study: [
				"Business",
				"Computer Science",
				"Media & Communication",
			],
		},
	},
} as const;
