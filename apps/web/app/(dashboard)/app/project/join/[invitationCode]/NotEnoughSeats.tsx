import { UserX } from "lucide-react";

interface NotEnoughSeatsProps {
  projectName: string;
}

export const NotEnoughSeats = ({ projectName }: NotEnoughSeatsProps) => {
  return (
    <div className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
      <UserX className="w-12 h-12 mx-auto text-gray-400" />
      <span className="mt-2 block text-base leading-6 font-semibold text-white-900">
        Not Enough Seats in {projectName}
      </span>
      <span className="mt-2 block text-sm font-semibold text-gray-600">
        The person who invited you needs to add more seats.
      </span>
    </div>
  );
};
