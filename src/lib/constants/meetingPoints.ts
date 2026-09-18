export const MEETING_POINTS = ["Morón", "San Justo", "Casanova"] as const;
export type MeetingPoint = (typeof MEETING_POINTS)[number];
