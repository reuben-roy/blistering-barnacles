import { ProfileShell } from "@/components/app/ProfileShell";
import { userProfile } from "@/lib/fixtures/user";

export default function ProfilePage() {
  return <ProfileShell initial={userProfile} />;
}
