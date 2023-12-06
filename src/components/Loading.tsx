import screenlinkLogo from "../assets/screenlink.svg";
export const Loading = ({
  loadingMessage,
}: {
  loadingMessage?: string | null;
}) => {
  return (
    <div className="card items-center justify-center min-h-screen w-screen">
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-16 w-auto mb-4 cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110"
            src={screenlinkLogo}
            alt="ScreenLink"
            onClick={() => {
              window.electron.openInBrowser("https://screenlink.io/app");
            }}
          />
          <div className="mx-auto animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-600"></div>
          <p className="mx-auto mt-8 text-lg font-medium text-center">
            {loadingMessage || "Loading..."}
          </p>
        </div>
      </div>
    </div>
  );
};
