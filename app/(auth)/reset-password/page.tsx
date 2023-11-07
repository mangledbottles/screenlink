export const metadata = {
  title: 'Reset Password - Cube',
  description: 'Page description',
}

export default function ResetPassword() {
  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
      <div className="pt-32 pb-12 md:pt-40 md:pb-20">
        {/* Page header */}
        <div className="max-w-3xl mx-auto text-center pb-12">
          <h1 className="h2 font-hkgrotesk">Change your password</h1>
        </div>
        {/* Form */}
        <div className="max-w-sm mx-auto">
          <form>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-500 font-medium mb-1" htmlFor="email">
                  Email
                </label>
                <input id="email" className="form-input text-sm py-2 w-full" type="email" required />
              </div>
            </div>
            <div className="mt-6">
              <button className="btn-sm text-sm text-white bg-indigo-500 hover:bg-indigo-600 w-full shadow-sm group">
                Reset Password{' '}
                <span className="tracking-normal text-sky-300 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">
                  -&gt;
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
