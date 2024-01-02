import Title from "@/components/title";
import Link from "next/link";
import { GrShieldSecurity } from "react-icons/gr"

export default function Privacy() {
    return <div className="w-screen min-h-screen bg-sky-500 text-gray-700">
        <header className="flex bg-white px-20 py-6 items-center w-full justify-between">
            <Title />
            <div className="flex text-sky-500 space-x-6 items-center">
                <Link href="/login" className="bg-sky-500 text-white text-lg px-6 py-1 rounded-md font-semibold">Login</Link>
            </div>
        </header>

        <main className="px-20 mt-12">
            <div className="w-full bg-white rounded-xl">
                <h1 className="flex text-gray-600 items-center space-x-2 text-2xl font-semibold px-6 py-2 border-b-[4px] border-sky-500"><GrShieldSecurity /> <span>Chính sách bảo mật</span></h1>

                <section className="section-content font-semibold text-sm px-6 py-4 space-y-1">
                    <p className="max-w-[80%]">We has built the Goza chat as a free app. This service is provided by Goza chat for free.</p>
                    <p className="max-w-[80%]">This page is used to inform visitors about the policies with the collection, use and disclosure of personal information if anyone decides to use our service.</p>
                    <p className="max-w-[80%]">By using our app, you agree to the collection and use of information in accordance with this policy. The personal information that we collect is used to provide and improve the service. We will not use or share your information with anyone except as described in this privacy policy.</p>
                    <p className="max-w-[80%]">The terms used in this privacy policy have the same meanings as in our terms and conditions, which can be accessed at Goza chat unless otherwise defined in this privacy policy.</p>
                </section>

                <section className="section-content font-semibold text-sm px-6 py-4 space-y-1">
                    <h2 className="section-title text-lg font-semibold">Collection and Use of Information</h2>
                    <p className="max-w-[80%]">To provide you with a better experience, we may ask you to provide us with some personal information, such as your name, email, phone number, location, messages, photos, videos, and device ID.</p>
                    <p className="max-w-[80%]">We collect this information through your input, device permissions, cookies, and third-party services.</p>
                    <p className="max-w-[80%]">We use this information to provide and improve our chat service, to personalize your user experience, to send you marketing communications, and to comply with legal obligations.</p>
                </section>

                <section className="section-content font-semibold text-sm px-6 py-4 space-y-1">
                    <h2 className="section-title text-lg font-semibold">Information Sharing and Disclosure</h2>
                    <p className="max-w-[80%]">We may share your personal information with other parties, such as our affiliates, partners, service providers, advertisers, or authorities, for the following purposes:</p>
                    <ul className="list-disc space-y-1 px-6">
                        <li>To facilitate the operation of our app and the provision of our chat service</li>
                        <li>To perform analysis, research, and development related to our app and chat service</li>
                        <li>To deliver relevant advertisements and promotions to you</li>
                        <li>To protect the rights, property, and safety of our app, our users, and the public</li>
                        <li>To comply with legal requirements, such as court orders, subpoenas, or warrants</li>
                        <li>To respond to your inquiries or complaints</li>
                    </ul>
                    <p className="max-w-[80%]">We will not sell, rent, or trade your personal information with any third party without your consent, except as described in this policy.</p>
                </section>

                <section className="section-content font-semibold text-sm px-6 py-4 space-y-1">
                    <h2 className="section-title text-lg font-semibold">Information Security</h2>
                    <p className="max-w-[80%]">We take reasonable measures to protect your personal information from unauthorized access, use, modification, or disclosure. We use encryption, security protocols, access controls, and other technical and organizational methods to safeguard your information.</p>
                    <p className="max-w-[80%]">However, no method of transmission over the internet or method of electronic storage is 100% secure. Therefore, we cannot guarantee the absolute security of your information.</p>
                </section>

                <section className="section-content font-semibold text-sm px-6 py-4 space-y-1">
                    <h2 className="section-title text-lg font-semibold">Information Retention</h2>
                    <p className="max-w-[80%]">We will retain your personal information for as long as necessary to provide you with our chat service, or as required by law, whichever is longer. We will delete your personal information when it is no longer needed, or when you request us to do so.</p>
                </section>

                <section className="section-content font-semibold text-sm px-6 py-4 space-y-1">
                    <h2 className="section-title text-lg font-semibold">User Rights</h2>
                    <p className="max-w-[80%]">You have certain rights regarding your personal information, such as the right to access, correct, delete, or withdraw consent to your information. You can exercise these rights by contacting us through the contact details provided below.</p>
                    <p className="max-w-[80%]">You can also change your preferences regarding the collection and use of your information by adjusting the settings in our app.</p>
                </section>

                <section className="section-content font-semibold text-sm px-6 py-4 space-y-1">
                    <h2 className="section-title text-lg font-semibold">Contact Us </h2>
                    <p className="max-w-[80%]">If you have any questions or concerns about our privacy policy, or if you want to exercise your rights regarding your personal information, please contact us at:</p>
                    <ul className="list-disc space-y-1 px-6">
                        <li>Name: Goza chat</li>
                        <li>Email: gozachatapp@gmail.com</li>
                    </ul>
                </section>

                <section className="section-content font-semibold text-sm px-6 py-4 space-y-1">
                    <p className="max-w-[80%]">We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page. You are advised to review this privacy policy periodically for any changes. Changes to this privacy policy are effective when they are posted on this page.</p>
                </section>

            </div>

        </main>

        <footer className="mt-12 px-20">
            
        </footer>
    </div>
}