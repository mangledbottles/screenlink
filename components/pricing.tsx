'use client'

import { useState } from 'react'
import Image from 'next/image'
import Illustration from '@/public/images/pricing-illustration.svg'

export default function Pricing() {
  const [annual, setAnnual] = useState<boolean>(true)

  return (
    <section className="relative">
      {/* Illustration */}
      <div className="hidden lg:block absolute bottom-0 left-1/2 -translate-x-1/2 -mb-24 pointer-events-none -z-10" aria-hidden="true">
        <Image src={Illustration} className="max-w-none" alt="Pricing Illustration" />
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-10 pb-12 md:pb-20">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
            <h2 className="h2 font-hkgrotesk mb-4">Let's find the right plan for you business</h2>
            <p className="text-xl text-slate-500">
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est.
            </p>
          </div>
          {/* Pricing tables */}
          <div className="grid md:grid-cols-6">
            {/* Pricing toggle */}
            <div className="flex flex-col justify-center p-4 md:px-6 bg-slate-800 md:col-span-3">
              <div className="flex justify-center md:justify-start items-center space-x-4">
                <div className="text-sm text-slate-500 font-medium min-w-[6rem] md:min-w-0 text-right">Monthly</div>
                <div className="form-switch shrink-0">
                  <input type="checkbox" id="toggle" className="sr-only" checked={annual} onChange={() => setAnnual(!annual)} />
                  <label className="bg-slate-900" htmlFor="toggle">
                    <span className="bg-slate-200" aria-hidden="true" />
                    <span className="sr-only">Pay annually</span>
                  </label>
                </div>
                <div className="text-sm text-slate-500 font-medium min-w-[6rem]">
                  Yearly <span className="text-emerald-500">(-20%)</span>
                </div>
              </div>
            </div>
            {/* Starter price */}
            <div className="flex flex-col justify-center p-4 md:px-6 bg-slate-800 md:border-l border-slate-700 order-1 md:order-none md:text-center mt-6 md:mt-0">
              <div className="font-hkgrotesk text-lg font-bold text-indigo-500 mb-0.5">Starter</div>
              <div>
                <span className="text-xl font-semibold">$</span><span className="text-2xl font-semibold">{annual ? '29' : '35'}</span><span className="text-sm text-slate-500 font-medium">/mo</span>
              </div>
            </div>
            {/* Agency price */}
            <div className="flex flex-col justify-center p-4 md:px-6 bg-slate-800 md:border-l border-slate-700 order-2 md:order-none md:text-center mt-6 md:mt-0">
              <div className="font-hkgrotesk text-lg font-bold text-indigo-500 mb-0.5">Agency</div>
              <div>
                <span className="text-xl font-semibold">$</span><span className="text-2xl font-semibold">{annual ? '49' : '55'}</span><span className="text-sm text-slate-500 font-medium">/mo</span>
              </div>
            </div>
            {/* Team price */}
            <div className="flex flex-col justify-center p-4 md:px-6 bg-slate-800 md:border-l border-slate-700 order-3 md:order-none md:text-center mt-6 md:mt-0">
              <div className="font-hkgrotesk text-lg font-bold text-indigo-500 mb-0.5">Team</div>
              <div>
                <span className="text-xl font-semibold">$</span><span className="text-2xl font-semibold">{annual ? '79' : '85'}</span><span className="text-sm text-slate-500 font-medium">/mo</span>
              </div>
            </div>
            {/* Usage label */}
            <div className="hidden md:flex flex-col justify-center px-4 md:px-6 py-2 bg-slate-700 bg-opacity-25 md:col-span-3">
              <span className="text-xs uppercase font-semibold text-slate-500">Usage</span>
            </div>
            <div className="flex flex-col justify-center px-4 md:px-6 py-2 bg-slate-700 bg-opacity-25 md:border-l border-slate-700 order-1 md:order-none">
              <span className="md:hidden text-xs uppercase font-semibold text-slate-500">Usage</span>
            </div>
            <div className="flex flex-col justify-center px-4 md:px-6 py-2 bg-slate-700 bg-opacity-25 md:border-l border-slate-700 order-2 md:order-none">
              <span className="md:hidden text-xs uppercase font-semibold text-slate-500">Usage</span>
            </div>
            <div className="flex flex-col justify-center px-4 md:px-6 py-2 bg-slate-700 bg-opacity-25 md:border-l border-slate-700 order-3 md:order-none">
              <span className="md:hidden text-xs uppercase font-semibold text-slate-500">Usage</span>
            </div>
            {/* Admins & Members */}
            <div className="hidden md:flex flex-col justify-center p-4 md:px-6 bg-slate-800 md:col-span-3">
              <div className="text-slate-200">Admins &amp; Members</div>
            </div>
            <div className="flex justify-between md:flex-col md:justify-center p-4 md:px-6 bg-slate-800 md:border-l border-slate-700 order-1 md:order-none">
              <div className="md:hidden text-slate-200">Admins &amp; Members</div>
              <div className="text-sm font-medium text-slate-200 text-center">4</div>
            </div>
            <div className="flex justify-between md:flex-col md:justify-center p-4 md:px-6 bg-slate-800 md:border-l border-slate-700 order-2 md:order-none">
              <div className="md:hidden text-slate-200">Admins &amp; Members</div>
              <div className="text-sm font-medium text-slate-200 text-center">12</div>
            </div>
            <div className="flex justify-between md:flex-col md:justify-center p-4 md:px-6 bg-slate-800 md:border-l border-slate-700 order-3 md:order-none">
              <div className="md:hidden text-slate-200">Admins &amp; Members</div>
              <div className="text-sm font-medium text-slate-200 text-center">Unlimited</div>
            </div>
            {/* File Storage */}
            <div className="hidden md:flex flex-col justify-center p-4 md:px-6 bg-slate-800 bg-opacity-70 md:col-span-3">
              <div className="text-slate-200">File Storage</div>
            </div>
            <div className="flex justify-between md:flex-col md:justify-center p-4 md:px-6 bg-slate-800 bg-opacity-70 md:border-l border-slate-700 order-1 md:order-none">
              <div className="md:hidden text-slate-200">File Storage</div>
              <div className="text-sm font-medium text-slate-200 text-center">10GB</div>
            </div>
            <div className="flex justify-between md:flex-col md:justify-center p-4 md:px-6 bg-slate-800 bg-opacity-70 md:border-l border-slate-700 order-2 md:order-none">
              <div className="md:hidden text-slate-200">File Storage</div>
              <div className="text-sm font-medium text-slate-200 text-center">50GB</div>
            </div>
            <div className="flex justify-between md:flex-col md:justify-center p-4 md:px-6 bg-slate-800 bg-opacity-70 md:border-l border-slate-700 order-3 md:order-none">
              <div className="md:hidden text-slate-200">File Storage</div>
              <div className="text-sm font-medium text-slate-200 text-center">Unlimited</div>
            </div>
            {/* Active Users */}
            <div className="hidden md:flex flex-col justify-center p-4 md:px-6 bg-slate-800 md:col-span-3">
              <div className="text-slate-200">Active Users</div>
            </div>
            <div className="flex justify-between md:flex-col md:justify-center p-4 md:px-6 bg-slate-800 md:border-l border-slate-700 order-1 md:order-none">
              <div className="md:hidden text-slate-200">Active Users</div>
              <div className="text-sm font-medium text-slate-200 text-center">500</div>
            </div>
            <div className="flex justify-between md:flex-col md:justify-center p-4 md:px-6 bg-slate-800 md:border-l border-slate-700 order-2 md:order-none">
              <div className="md:hidden text-slate-200">Active Users</div>
              <div className="text-sm font-medium text-slate-200 text-center">1500</div>
            </div>
            <div className="flex justify-between md:flex-col md:justify-center p-4 md:px-6 bg-slate-800 md:border-l border-slate-700 order-3 md:order-none">
              <div className="md:hidden text-slate-200">Active Users</div>
              <div className="text-sm font-medium text-slate-200 text-center">Unlimited</div>
            </div>
            {/* Features label */}
            <div className="hidden md:flex flex-col justify-center px-4 md:px-6 py-2 bg-slate-700 bg-opacity-25 md:col-span-3">
              <span className="text-xs uppercase font-semibold text-slate-500">Features</span>
            </div>
            <div className="flex flex-col justify-center px-4 md:px-6 py-2 bg-slate-700 bg-opacity-25 md:border-l border-slate-700 order-1 md:order-none">
              <span className="md:hidden text-xs uppercase font-semibold text-slate-500">Features</span>
            </div>
            <div className="flex flex-col justify-center px-4 md:px-6 py-2 bg-slate-700 bg-opacity-25 md:border-l border-slate-700 order-2 md:order-none">
              <span className="md:hidden text-xs uppercase font-semibold text-slate-500">Features</span>
            </div>
            <div className="flex flex-col justify-center px-4 md:px-6 py-2 bg-slate-700 bg-opacity-25 md:border-l border-slate-700 order-3 md:order-none">
              <span className="md:hidden text-xs uppercase font-semibold text-slate-500">Features</span>
            </div>
            {/* Unlimited Activities */}
            <div className="hidden md:flex flex-col justify-center p-4 md:px-6 bg-slate-800 md:col-span-3">
              <div className="text-slate-200">Unlimited Activities</div>
            </div>
            <div className="flex justify-between md:flex-col md:justify-center p-4 md:px-6 bg-slate-800 md:border-l border-slate-700 order-1 md:order-none">
              <div className="md:hidden text-slate-200">Unlimited Activities</div>
              <div className="text-sm font-medium text-slate-200 text-center">
                <svg className="inline-flex fill-emerald-400" width="12" height="9" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10.28.28 3.989 6.575 1.695 4.28A1 1 0 0 0 .28 5.695l3 3a1 1 0 0 0 1.414 0l7-7A1 1 0 0 0 10.28.28Z"
                    fill="#34D399"
                    fillRule="nonzero"
                  />
                </svg>
              </div>
            </div>
            <div className="flex justify-between md:flex-col md:justify-center p-4 md:px-6 bg-slate-800 md:border-l border-slate-700 order-2 md:order-none">
              <div className="md:hidden text-slate-200">Unlimited Activities</div>
              <div className="text-sm font-medium text-slate-200 text-center">
                <svg className="inline-flex fill-emerald-400" width="12" height="9" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10.28.28 3.989 6.575 1.695 4.28A1 1 0 0 0 .28 5.695l3 3a1 1 0 0 0 1.414 0l7-7A1 1 0 0 0 10.28.28Z"
                    fill="#34D399"
                    fillRule="nonzero"
                  />
                </svg>
              </div>
            </div>
            <div className="flex justify-between md:flex-col md:justify-center p-4 md:px-6 bg-slate-800 md:border-l border-slate-700 order-3 md:order-none">
              <div className="md:hidden text-slate-200">Unlimited Activities</div>
              <div className="text-sm font-medium text-slate-200 text-center">
                <svg className="inline-flex fill-emerald-400" width="12" height="9" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10.28.28 3.989 6.575 1.695 4.28A1 1 0 0 0 .28 5.695l3 3a1 1 0 0 0 1.414 0l7-7A1 1 0 0 0 10.28.28Z"
                    fill="#34D399"
                    fillRule="nonzero"
                  />
                </svg>
              </div>
            </div>
            {/* Data Export */}
            <div className="hidden md:flex flex-col justify-center p-4 md:px-6 bg-slate-800 bg-opacity-70 md:col-span-3">
              <div className="text-slate-200">Data Export</div>
            </div>
            <div className="flex justify-between md:flex-col md:justify-center p-4 md:px-6 bg-slate-800 bg-opacity-70 md:border-l border-slate-700 order-1 md:order-none">
              <div className="md:hidden text-slate-200">Data Export</div>
              <div className="text-sm font-medium text-slate-200 text-center">
                <svg className="inline-flex fill-slate-500" width="14" height="2" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 0v2H0V0z" fillRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="flex justify-between md:flex-col md:justify-center p-4 md:px-6 bg-slate-800 bg-opacity-70 md:border-l border-slate-700 order-2 md:order-none">
              <div className="md:hidden text-slate-200">Data Export</div>
              <div className="text-sm font-medium text-slate-200 text-center">
                <svg className="inline-flex fill-emerald-400" width="12" height="9" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10.28.28 3.989 6.575 1.695 4.28A1 1 0 0 0 .28 5.695l3 3a1 1 0 0 0 1.414 0l7-7A1 1 0 0 0 10.28.28Z"
                    fill="#34D399"
                    fillRule="nonzero"
                  />
                </svg>
              </div>
            </div>
            <div className="flex justify-between md:flex-col md:justify-center p-4 md:px-6 bg-slate-800 bg-opacity-70 md:border-l border-slate-700 order-3 md:order-none">
              <div className="md:hidden text-slate-200">Data Export</div>
              <div className="text-sm font-medium text-slate-200 text-center">
                <svg className="inline-flex fill-emerald-400" width="12" height="9" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10.28.28 3.989 6.575 1.695 4.28A1 1 0 0 0 .28 5.695l3 3a1 1 0 0 0 1.414 0l7-7A1 1 0 0 0 10.28.28Z"
                    fill="#34D399"
                    fillRule="nonzero"
                  />
                </svg>
              </div>
            </div>
            {/* Adjust Group Sizes */}
            <div className="hidden md:flex flex-col justify-center p-4 md:px-6 bg-slate-800 md:col-span-3">
              <div className="text-slate-200">Adjust Group Sizes</div>
            </div>
            <div className="flex justify-between md:flex-col md:justify-center p-4 md:px-6 bg-slate-800 md:border-l border-slate-700 order-1 md:order-none">
              <div className="md:hidden text-slate-200">Adjust Group Sizes</div>
              <div className="text-sm font-medium text-slate-200 text-center">
                <svg className="inline-flex fill-slate-500" width="14" height="2" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 0v2H0V0z" fillRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="flex justify-between md:flex-col md:justify-center p-4 md:px-6 bg-slate-800 md:border-l border-slate-700 order-2 md:order-none">
              <div className="md:hidden text-slate-200">Adjust Group Sizes</div>
              <div className="text-sm font-medium text-slate-200 text-center">
                <svg className="inline-flex fill-emerald-400" width="12" height="9" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10.28.28 3.989 6.575 1.695 4.28A1 1 0 0 0 .28 5.695l3 3a1 1 0 0 0 1.414 0l7-7A1 1 0 0 0 10.28.28Z"
                    fill="#34D399"
                    fillRule="nonzero"
                  />
                </svg>
              </div>
            </div>
            <div className="flex justify-between md:flex-col md:justify-center p-4 md:px-6 bg-slate-800 md:border-l border-slate-700 order-3 md:order-none">
              <div className="md:hidden text-slate-200">Adjust Group Sizes</div>
              <div className="text-sm font-medium text-slate-200 text-center">
                <svg className="inline-flex fill-emerald-400" width="12" height="9" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10.28.28 3.989 6.575 1.695 4.28A1 1 0 0 0 .28 5.695l3 3a1 1 0 0 0 1.414 0l7-7A1 1 0 0 0 10.28.28Z"
                    fill="#34D399"
                    fillRule="nonzero"
                  />
                </svg>
              </div>
            </div>
            {/* CTA row */}
            <div className="hidden md:flex flex-col justify-center px-4 md:px-6 py-2 bg-slate-700 bg-opacity-25 md:col-span-3" />
            <div className="flex flex-col justify-center p-4 bg-slate-700 bg-opacity-25 md:border-l border-slate-700 order-1 md:order-none">
              <a className="btn-sm text-white bg-indigo-500 hover:bg-indigo-600 w-full shadow-sm group whitespace-nowrap" href="#0">
                Free Trial{' '}
                <span className="hidden lg:block tracking-normal text-sky-300 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">
                  -&gt;
                </span>
              </a>
            </div>
            <div className="flex flex-col justify-center p-4 bg-slate-700 bg-opacity-25 md:border-l border-slate-700 order-2 md:order-none">
              <a className="btn-sm text-white bg-indigo-500 hover:bg-indigo-600 w-full shadow-sm group whitespace-nowrap" href="#0">
                Free Trial{' '}
                <span className="hidden lg:block tracking-normal text-sky-300 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">
                  -&gt;
                </span>
              </a>
            </div>
            <div className="flex flex-col justify-center p-4 bg-slate-700 bg-opacity-25 md:border-l border-slate-700 order-3 md:order-none">
              <a className="btn-sm text-white bg-indigo-500 hover:bg-indigo-600 w-full shadow-sm group whitespace-nowrap" href="#0">
                Free Trial{' '}
                <span className="hidden lg:block tracking-normal text-sky-300 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">
                  -&gt;
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}