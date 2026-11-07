import { christmasCandidates } from "@/content/staged/christmas";
import { winterSeasonalCandidates } from "@/content/staged/winter-seasonal";
import { evergreenPilotCandidates } from "@/content/staged/evergreen-pilot";
import { seasonalClassroomCandidates } from "@/content/staged/seasonal-classroom";
import { evergreenHardBatch } from "@/content/staged/evergreen-hard-batch";
import { teacherSubjectCandidates } from "@/content/staged/teacher-subjects";

/** Offline review catalog only. Never import this from a public runtime registry. */
export const stagedCandidateGroups = [
  { id: "christmas", candidates: christmasCandidates },
  { id: "winter", candidates: winterSeasonalCandidates },
  { id: "evergreen-pilot", candidates: evergreenPilotCandidates },
  { id: "seasonal-classroom", candidates: seasonalClassroomCandidates },
  { id: "evergreen-hard", candidates: evergreenHardBatch },
  { id: "teacher-subjects", candidates: teacherSubjectCandidates }
];
export const allStagedCandidates = stagedCandidateGroups.flatMap(({ candidates }) => candidates);
