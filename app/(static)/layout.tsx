import Link from "next/link";
import Image from "next/image";
import { ThemeSwitch } from "@/components/Theme";
import ProfileMenu from "@/components/ProfileMenu";
import { useAuth } from "../Auth";
import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import { cookies } from "next/headers";
import { firebaseAdmin } from "@/lib/firebase/admin";
import { getUserData } from "../actions";
import { redirect } from "next/navigation";
// import Button from "@/components/Button"
// import ProfileMenu from "@/components/ProfileMenu"

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value || "";
  let uid;
  try {
    // Verify the ID token on the server-side
    const res = await firebaseAdmin.auth().verifyIdToken(token);
    uid = res.uid;
  } catch (error) {
    console.error("Error verifying ID token:", error);
    // Handle verification error (e.g., redirect to login)
  }
  // if (!uid) {
  //   redirect("/login");
  // }

  let user;
  if (uid) {
    user = await (await getUserData(uid)).toJSON();
  }

  return (
    <div className="max-w-5xl min-h-screen px-4 mx-auto overflow-x-hidden flex flex-col justify-between">
      <nav className="flex py-4 items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-4">
            <Image alt="logo" src="/formulate.svg" width={20} height={20} />
            <p className="text-xl leading-none">FormUlate</p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          {user ? <ProfileMenu {...user} /> : null}
          <ThemeSwitch />
        </div>
      </nav>
      <main className="flex-1 w-full h-full py-24">{children}</main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t dark:border-gray-600">
        <Link href={"/"} className="text-xs text-gray-500 dark:text-gray-400">
          © FormUlate.
        </Link>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-xs hover:underline underline-offset-4"
            href="/terms"
          >
            Terms of Service
          </Link>
          <Link
            className="text-xs hover:underline underline-offset-4"
            href="/policy"
          >
            Privacy
          </Link>
          <Link
            className="text-xs hover:underline underline-offset-4"
            href="/form/contact-us"
          >
            Contact
          </Link>
        </nav>
      </footer>
    </div>
  );
}
