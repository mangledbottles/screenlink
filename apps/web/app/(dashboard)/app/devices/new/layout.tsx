interface DeviceAuthorizationLayoutProps {
  children: React.ReactNode;
}

export default function DeviceAuthorizationLayout({
  children,
}: DeviceAuthorizationLayoutProps) {
  return (
    <>
      <div className="mt-16"></div>
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-4">
        <div className="hidden space-y-6 p-6  pb-16 md:block bg-[#0E131D] rounded-lg">
          <div className="space-y-0.5 pt-2 pr-60">
            <h2 className="text-2xl font-bold tracking-tight">
              Authorize New Device
            </h2>
            <p className="text-muted-foreground">
              Add a new device to use with ScreenLink Desktop
            </p>
          </div>

          <div className="max-w-6xl mx-auto mt-20">{children}</div>
        </div>
      </div>
    </>
  );
}
