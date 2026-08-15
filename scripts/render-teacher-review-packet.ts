import { lessonPackageHandoffs } from "../app/data/lesson-package-handoffs.ts";
import { renderTeacherReviewPacket } from "../app/utils/teacher-review-packet.ts";

const defaultPackageId = "lesson-19-polite-exchanges-package";
const packageId = process.argv[2] ?? defaultPackageId;
const handoff = lessonPackageHandoffs.find((item) => item.package.id === packageId);

if (!handoff) {
  const available = lessonPackageHandoffs.map((item) => item.package.id).join(", ");
  throw new Error(`Unknown package ${packageId}. Available packages: ${available}`);
}

process.stdout.write(renderTeacherReviewPacket(handoff));
