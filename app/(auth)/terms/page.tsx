import Title from "@/components/title";
import Link from "next/link";
import { GrServices } from "react-icons/gr"

export default function Terms() {
    return <div className="w-screen min-h-screen bg-sky-500 text-gray-700">
        <header className="flex bg-white px-20 py-6 items-center w-full justify-between">
            <Title />
            <div className="flex text-sky-500 space-x-6 items-center">
                <Link href="/login" className="bg-sky-500 text-white text-lg px-6 py-1 rounded-md font-semibold">Login</Link>
            </div>
        </header>

        <main className="px-20 mt-12">
            <div className="w-full bg-white rounded-xl">
                <h1 className="flex text-gray-600 items-center space-x-2 text-2xl font-semibold px-6 py-2 border-b-[4px] border-sky-500"><GrServices /> <span>Terms and Conditions</span></h1>
                <section className="section-content font-semibold text-sm px-6 py-4 space-y-1">
                    <p className="max-w-[80%]">Welcome to Goza chat, a chatting application that allows you to chat with other users around the world. Goza chat is owned and operated by Goza Inc.</p>
                    <p className="max-w-[80%]">By downloading, installing, or using Goza chat, you agree to be bound by these terms and conditions. If you do not agree to these terms and conditions, please do not use Goza chat.</p>
                </section>

                <section className="section-content font-semibold text-sm px-6 py-4 space-y-1">
                    <h2 className="section-title text-lg font-semibold">License to Use</h2>
                    <p className="max-w-[80%]">We grant you a limited, non-exclusive, non-transferable, revocable license to use Chatting App for your personal, non-commercial purposes, subject to these terms and conditions and our privacy policy.</p>
                    <p>You may not:</p>
                    <ul className="list-disc space-y-1 px-6">
                        <li>Copy, modify, distribute, sell, or lease any part of Goza chat or its content</li>
                        <li>Reverse engineer, decompile, or disassemble Goza chat or attempt to extract its source code</li>
                        <li>Use Goza chat for any illegal, fraudulent, or harmful activities</li>
                        <li>Use Goza chat to infringe the rights of others, including their privacy, intellectual property, or contractual rights</li>
                        <li>Use Goza chat to transmit any viruses, malware, or other malicious code</li>
                        <li>Use Goza chat to interfere with or disrupt the operation of Goza chat or any other services or networks connected to it</li>
                        <li>Use Goza chat to impersonate any person or entity, or misrepresent your affiliation with any person or entity</li>
                        <li>Use Goza chat to collect or harvest any personal information from other users</li>
                        <li>Use Goza chat to send any unsolicited or unauthorized advertising, promotional materials, spam, or any other form of solicitation</li>
                    </ul>
                    <p className="max-w-[80%]">We reserve the right to terminate your license to use Chatting App at any time, without notice, for any reason, including but not limited to your violation of these terms and conditions or our privacy policy.</p>
                </section>

                <section className="section-content font-semibold text-sm px-6 py-4 space-y-1">
                    <h2 className="section-title text-lg font-semibold">User Accounts</h2>
                    <p className="max-w-[80%]">
                        To use some features of Goza chat, you may need to create an account. You are responsible for maintaining the security and confidentiality of your account and password, and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or password, or any other breach of security.
                    </p>
                    <p className="max-w-[80%]">
                        You may not use the account of another user without their permission. You may not create more than one account for yourself, or create an account for anyone else without their permission. You may not transfer your account to anyone else without our prior written consent.
                    </p>
                    <p className="max-w-[80%]">
                        We reserve the right to suspend or terminate your account at any time, without notice, for any reason, including but not limited to your violation of these terms and conditions or our privacy policy.
                    </p>
                </section>

                <section className="section-content font-semibold text-sm px-6 py-4 space-y-1">
                    <h2 className="section-title text-lg font-semibold">User Content</h2>
                    <p className="max-w-[80%]">
                        Goza chat allows you to create, upload, post, share, or otherwise make available text, images, videos, audio, or other materials (collectively, “User Content”).
                        You retain ownership of your User Content, but you grant us a worldwide, non-exclusive, royalty-free, perpetual, irrevocable, transferable, and sublicensable license to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, perform, and display your User Content in connection with Goza chat and our business, including for the purpose of promoting and improving Goza chat.
                    </p>
                    <p>You represent and warrant that:</p>
                    <ul className="list-disc space-y-1 px-6">
                        <li>You own or have the necessary rights and permissions to use and share your User Content</li>
                        <li>Your User Content does not violate the rights of others, including their privacy, intellectual property, or contractual rights</li>
                        <li>Your User Content does not contain any illegal, fraudulent, or harmful content, or any content that is obscene, defamatory, hateful, harassing, threatening, abusive, or otherwise objectionable</li>
                        <li>Your User Content does not contain any viruses, malware, or other malicious code</li>
                    </ul>
                    <p className="max-w-[80%]">We do not endorse, support, represent, or guarantee the completeness, truthfulness, accuracy, or reliability of any User Content.
                        You understand and agree that by using Goza chat, you may be exposed to User Content that is offensive, harmful, inaccurate, or otherwise inappropriate.
                        You also understand and agree that we are not responsible or liable for any User Content, or for any loss or damage of any kind incurred as a result of the use of any User Content.</p>
                    <p className="max-w-[80%]">We reserve the right, but not the obligation, to review, monitor, edit, remove, or disable access to any User Content at any time, without notice, for any reason, including but not limited to your violation of these terms and conditions or our privacy policy.</p>
                </section>

                <section className="section-content font-semibold text-sm px-6 py-4 space-y-1">
                    <h2 className="section-title text-lg font-semibold">Changes to These Terms and Conditions</h2>
                    <p className="max-w-[80%]">
                        We may update or modify these terms and conditions at any time, with or without notice, for any reason, such as to reflect changes in our app, our business, or the law.
                        We will notify you of any changes to these terms and conditions by posting the updated version on Goza chat or on the app store from which you downloaded Goza chat. Your continued use of Goza chat after the changes take effect constitutes your acceptance of the new terms and conditions. If you do not agree to the new terms and conditions, please stop using Goza chat.
                    </p>
                </section>
            </div>
        </main>

        <footer className="mt-12 px-20">

        </footer>
    </div>
}