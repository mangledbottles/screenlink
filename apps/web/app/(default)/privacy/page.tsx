import "@/app/css/additional-styles/utility-patterns.css";
import "@/app/css/additional-styles/range-slider.css";
import "@/app/css/additional-styles/toggle-switch.css";
import "@/app/css/additional-styles/theme.css";
import { constructMetadata } from "../../utils";

export const metadata = constructMetadata({});

export default function Privacy() {
  return (
    <div className="relative py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
            Privacy Policy
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-400 lg:mx-auto">
            ScreenLink is committed to protecting the privacy and security of its users' personal information. This Privacy Policy explains how we collect, use, process, and store your personal information.
          </p>
        </div>

        <div className="mt-10">
          <h3 className="text-lg leading-6 font-medium text-white">Collection of Personal Information</h3>
          <p className="mt-2 text-base text-gray-400">
            ScreenLink collects personal information from you when you sign up for an account, use our services, or interact with our website. The personal information we collect may include your name, email address, phone number, and location.
          </p>
        </div>

        <div className="mt-10">
          <h3 className="text-lg leading-6 font-medium text-white">Use of Personal Information</h3>
          <p className="mt-2 text-base text-gray-400">
            ScreenLink uses your personal information to provide you with a personalized user experience and to improve our services. We may also use your personal information for internal purposes such as data analysis and research.
          </p>
        </div>

        <div className="mt-10">
          <h3 className="text-lg leading-6 font-medium text-white">Sharing of Personal Information</h3>
          <p className="mt-2 text-base text-gray-400">
            ScreenLink will not share your personal information with any third party without your consent, except as required by law. We may share your personal information with service providers who assist us in providing our services, such as payment processing and data analysis. These service providers are required to maintain the confidentiality and security of your personal information.
          </p>
        </div>

        <div className="mt-10">
          <h3 className="text-lg leading-6 font-medium text-white">Storage of Personal Information</h3>
          <p className="mt-2 text-base text-gray-400">
            ScreenLink stores your personal information on servers located in the European Union. We take appropriate security measures to protect your personal information from unauthorized access, use, or disclosure.
          </p>
        </div>

        <div className="mt-10">
          <h3 className="text-lg leading-6 font-medium text-white">Access to Personal Information</h3>
          <p className="mt-2 text-base text-gray-400">
            You have the right to access and control your personal information. You can request access to your personal information by contacting us at support@screenlink.io.
          </p>
        </div>

        <div className="mt-10">
          <h3 className="text-lg leading-6 font-medium text-white">Changes to this Privacy Policy</h3>
          <p className="mt-2 text-base text-gray-400">
            ScreenLink may make changes to this Privacy Policy from time to time. By using our services, you agree to be bound by the terms of this Privacy Policy.
          </p>
        </div>

        <div className="mt-10">
          <h3 className="text-lg leading-6 font-medium text-white">Contact Us</h3>
          <p className="mt-2 text-base text-gray-400">
            If you have any questions or concerns about this Privacy Policy, please contact us at support@screenlink.io.
          </p>
        </div>
      </div>
    </div>
  );
}