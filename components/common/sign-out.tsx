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
      <button type="submit" className="text-md">
        Logi välja
      </button>
    </form>
  );
}
