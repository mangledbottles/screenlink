import { authOptions } from "@/app/api/auth/[...nextauth]/AuthOptions";
import { Devices, PrismaClient } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  AiFillPlusCircle,
  AiFillProject,
  AiOutlineDownload,
} from "react-icons/ai";

export default async function Devices() {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  const userId = session?.user?.id;
  if (!session || !userId) {
    redirect("/signin?redirect=/app/devices");
  }
  const prisma = new PrismaClient();

  const devices = await prisma.devices.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    where: {
      userId,
    },
  });

  return (
    <section className="relative">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 mt-20">
        <div className="bg-slate-800 bg-opacity-60 rounded overflow-hidden">
          <div className="mx-auto max-w-7xl">
            <div className="py-5">
              <div className="px-4 sm:px-6">
                <div className="sm:flex sm:items-center">
                  <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-white">
                      Devices
                    </h1>
                    <p className="mt-2 text-sm text-gray-300">
                      A list of all devices that you have logged in with
                    </p>
                  </div>
                </div>
                {devices?.length === 0 && <NoDevices />}
                {devices?.length > 0 && (
                  <DevicesTable devices={devices} userId={userId} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const DevicesTable = ({
  devices,
  userId,
}: {
  devices: Devices[];
  userId: string;
}) => {
  const deviceTypeToName = (type: string) => {
    switch (type.toLowerCase()) {
      case "darwin":
        return "MacOS";
      case "win32":
        return "Windows";
      case "linux":
        return "Linux";
      default:
        return type;
    }
  };

  const revokeDevice = async (formData: FormData) => {
    "use server";

    try {
      const deviceId = formData.get("deviceId") as string;
      if (!deviceId) return;
      console.log(`Revoke device ${deviceId} for user ${userId}`);

      const prisma = new PrismaClient();
      await prisma.devices.update({
        where: {
          id: deviceId,
          userId,
          revoked: false, // Only revoke if it's not already revoked
        },
        data: {
          revoked: true,
        },
      });
      // Marks all device pages for revalidating
      revalidatePath("/app/devices");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                >
                  Operating System
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                >
                  Added
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                >
                  Last Interaction
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                >
                  Status
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {devices.map((device) => {
                const lastUpdated =
                  device.lastUploadAt && device.lastUploadAt > device.updatedAt
                    ? device.lastUploadAt
                    : device.updatedAt;
                return (
                  <tr key={device.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-0">
                      {device.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                      {deviceTypeToName(device.type)}
                    </td>
                    <td
                      className="whitespace-nowrap px-3 py-4 text-sm text-gray-300"
                      title={new Date(device.createdAt).toString()}
                    >
                      {formatDistanceToNow(new Date(device.createdAt))} ago
                    </td>
                    <td
                      className="whitespace-nowrap px-3 py-4 text-sm text-gray-300"
                      title={new Date(lastUpdated).toString()}
                    >
                      {formatDistanceToNow(new Date(lastUpdated))} ago
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                      {device.revoked ? (
                        <span className="inline-flex items-center rounded-md bg-pink-400/10 px-2 py-1 text-xs font-medium text-pink-400 ring-1 ring-inset ring-pink-400/20">
                          Revoked
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-md bg-blue-400/10 px-2 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-400/30">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <form action={revokeDevice}>
                        <input
                          type="hidden"
                          name="deviceId"
                          value={device.id}
                        />
                        <button
                          className="text-indigo-400 hover:text-indigo-300 cursor-pointer"
                          typeof="submit"
                        >
                          Revoke
                          <span className="sr-only">, {device.name}</span>
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const NoDevices = () => {
  return (
    <div className="text-center mt-6">
      <AiFillProject className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-semibold text-gray-100">No Devices</h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by downloading ScreenLink and logging in
      </p>
      <div className="mt-6">
        <Link href="/download">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <AiOutlineDownload
              className="-ml-0.5 mr-1.5 h-5 w-5"
              aria-hidden="true"
            />
            Download
          </button>
        </Link>
      </div>
    </div>
  );
};
