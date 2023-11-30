import screenlinkLogo from "../assets/screenlink.svg";
export const Permissions = () => {
  return (
    <>
      <div className="card">
        <div className="flex justify-center">
          <img
            className="h-10 w-auto mb-2 -mt-4 cursor-pointer"
            src={screenlinkLogo}
            alt="ScreenLink"
            onClick={() => {
              window.electron.openInBrowser("https://screenlink.io/app");
            }}
          />
        </div>
        <div className="flex flex-col space-y-4 w-4/6 mx-auto">
          <span className="text-center flex-grow pb-4">
            Enable camera, microphone and screen recording access to get started
          </span>
        </div>
        <p className="read-the-docs mb-4">
          Screenlink is an open-source video capture tool that lets you record
          your screen and camera to share with your team, customers, and
          friends.
        </p>
      </div>
    </>
  );
};
