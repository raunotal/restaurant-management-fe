import { signOut } from "@/lib/auth-config";
import Icon from "../ui/icons/icon";

export function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button type="submit" className="flex items-center gap-2">
        Logi välja <Icon type="signout" />
      </button>
    </form>
  );
}
