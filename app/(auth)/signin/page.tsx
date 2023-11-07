export const metadata = {
  title: 'Sign In - Cube',
  description: 'Page description',
}

import Link from 'next/link'

export default function SignIn() {
  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
      <div className="pt-32 pb-12 md:pt-40 md:pb-20">
        {/* Page header */}
        <div className="max-w-3xl mx-auto text-center pb-12">
          <h1 className="h2 font-hkgrotesk">Welcome back!</h1>
        </div>
        {/* Form */}
        <div className="max-w-sm mx-auto">
          <form>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 font-medium mb-1" htmlFor="email">
                  Email
                </label>
                <input id="email" className="form-input text-sm py-2 w-full" type="email" required />
              </div>
              <div>
                <div className="flex justify-between">
                  <label className="block text-sm text-slate-400 font-medium mb-1" htmlFor="password">
                    Password
                  </label>
                  <Link className="text-sm font-medium text-indigo-500 ml-2" href="/reset-password">
                    Forgot?
                  </Link>
                </div>
                <input id="password" className="form-input text-sm py-2 w-full" type="password" autoComplete="on" required />
              </div>
            </div>
            <div className="mt-6">
              <button className="btn-sm text-sm text-white bg-indigo-500 hover:bg-indigo-600 w-full shadow-sm group">
                Sign In{' '}
                <span className="tracking-normal text-sky-300 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">
                  -&gt;
                </span>
              </button>
            </div>
          </form>
          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="border-t border-slate-800 grow mr-3" aria-hidden="true" />
            <div className="text-sm text-slate-500 italic">Or</div>
            <div className="border-t border-slate-800 grow ml-3" aria-hidden="true" />
          </div>
          {/* Social login */}
          <button className="btn-sm text-sm text-white bg-rose-500 w-full relative flex after:flex-1">
            <div className="flex-1 flex items-center">
              <svg className="w-4 h-4 fill-current text-rose-200 shrink-0" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.679 6.545H8.043v3.273h4.328c-.692 2.182-2.401 2.91-4.363 2.91a4.727 4.727 0 1 1 3.035-8.347l2.378-2.265A8 8 0 1 0 8.008 16c4.41 0 8.4-2.909 7.67-9.455Z" />
              </svg>
            </div>
            <span className="flex-auto text-rose-50 pl-3">Continue With Google</span>
          </button>
          <div className="text-center mt-6">
            <div className="text-sm text-slate-500">
              Don't you have an account?{' '}
              <Link className="font-medium text-indigo-500" href="/signup">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
