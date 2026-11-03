export type SnackbarIcon = "check" | "error" | "info" | "warning";

export function showSnackbar(
    message: string,
    icon: SnackbarIcon = "info",
    duration = 5000
) {
    if (typeof window === "undefined") return;

    window.dispatchEvent(
        new CustomEvent("app-snackbar", {
            detail: { message, icon, duration }
        })
    );
}
