import { authOptions } from "@/app/api/auth/[...nextauth]/AuthOptions";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import crypto from "crypto";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AuthorizeDevice } from "./AuthorizeDevice";
import { RedirectToDevice } from "./RedirectToDevice";

export default async function Devices(query: {
  searchParams: {
    device?: string;
    deviceCode?: string;
    appVersion?: string;
    deviceType?: string;
  };
}) {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  const userId = session?.user?.id;
  const searchParams = query.searchParams;
  const device = searchParams.device ?? "Device";
  const appVersion = searchParams.appVersion ?? "Unknown";
  const deviceType = searchParams.deviceType ?? "Unknown";

  if (!userId || !session)
    return redirect(
      encodeURI(
        `/signup?redirect=/app/devices/new?device=${encodeURIComponent(
          device
        )}&appVersion=${encodeURIComponent(
          appVersion
        )}&deviceType=${encodeURIComponent(deviceType)}`
      )
    );

  if (searchParams.deviceCode) {
    const deviceCode = searchParams.deviceCode;
    return <RedirectToDevice deviceCode={deviceCode} />;
  }

  const confirmDevice = async (): Promise<void> => {
    "use server";
    console.log("confirmDevice");
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const userId = session?.user?.id;
    const prisma = new PrismaClient();
    if (!userId) return redirect("/");

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      // Handle the case where the user does not exist
      console.error(`User with ID ${userId} not found`);
      throw new Error("User not found");
    }

    const deviceCode = crypto.randomBytes(20).toString("hex");
    const newDevice = await prisma.devices.create({
      data: {
        name: device,
        code: deviceCode,
        appVersion,
        type: deviceType,
        user: {
          connect: { id: userId },
        },
      },
    });
    // Redirect to the same page with deviceCode in the URL
    redirect(`/app/devices/new?deviceCode=${deviceCode}`);
    // return { deviceCode };
  };

  return (
    <section className="relative">
      <div className="relative max-w-6xl mx-auto">
        <div className="bg-[#0E131D] shadow sm:rounded-lg">
          <div className="sm:p-6">
            <p className="text-lg leading-8 text-gray-400">
              You are logging in from a new device ({device ?? "Device"}).
              Please confirm that this is you.
            </p>
            <div className="mt-5 flex justify-start space-x-2">
              <AuthorizeDevice confirmDevice={confirmDevice} />
              <Link href="/">
                <button
                  type="button"
                  className="inline-flex items-center rounded-md bg-gray-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500"
                >
                  No, its not me
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
