import { authOptions } from "@/app/api/auth/[...nextauth]/AuthOptions";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import crypto from "crypto";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function Devices(query: {
  searchParams: { device?: string; deviceCode?: string };
}) {
  const searchParams = query.searchParams;
  const device = searchParams.device ?? "Device";

  if (searchParams.deviceCode) {
    const deviceCode = searchParams.deviceCode;
    redirect(`screenlinkDesktop://deviceCode=${deviceCode}`);
    return (
      <section className="relative">
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 mt-20">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Success! You can now close this window and return to the desktop
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const confirmDevice = async () => {
    "use server";
    console.log("confirmDevice");
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const userId = session?.user?.id;
    const prisma = new PrismaClient();

    const deviceCode = crypto.randomBytes(20).toString("hex");
    const newDevice = await prisma.devices.create({
      data: {
        name: device,
        code: deviceCode,
        type: "desktop",
        user: {
          connect: { id: userId },
        },
      },
    });
    // Redirect to the same page with deviceCode in the URL
    redirect(`/app/devices/new?deviceCode=${deviceCode}`);
  };

  return (
    <section className="relative">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 mt-20">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="mt-10 text-2xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Login to a new device
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              You are logging in from a new device ({device ?? "Device"}).
              Please confirm that this is you.
            </p>
            <div className="mt-5 flex justify-start space-x-2">
              <form action={confirmDevice}>
                <button
                  className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  type="submit"
                >
                  Yes! Log me in
                </button>
              </form>
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
