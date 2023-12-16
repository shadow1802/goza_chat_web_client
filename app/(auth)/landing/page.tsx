import Title from "@/components/title";
import { FaApple } from "react-icons/fa";
import { FaGooglePlay } from "react-icons/fa";
import { MdDone } from "react-icons/md"
import Header from "./landing.header";

export default function Landing() {
    return <div className="flex min-h-screen bg-cover bg-left w-screen flex-1 justify-center items-center">
        <div className="relative flex flex-col justify-center items-center bg-sky-500 h-full bg-center bg-cover">
        
            <Header />

            <img src="/images/bg.png" className="w-[840px]" alt="" />

        </div>
        <div className="h-full flex flex-col justify-between">

            <div></div>

            <div className="flex items-center space-x-12 px-40">
               
                <div>
                    <Title size={38} />
                    <div className="mt-2">

                        <p className="flex space-x-2 items-center text-sky-600 font-semibold"><MdDone className="text-sky-500 text-lg" /> <span>Bảo vệ quyền riêng tư mạnh mẽ</span></p>
                        <p className="flex space-x-2 items-center text-sky-600 font-semibold"><MdDone className="text-sky-500 text-lg" /> <span>Ứng dụng nhắn tin nhanh đa mã hóa</span></p>
                        <p className="flex space-x-2 items-center text-sky-600 font-semibold"><MdDone className="text-sky-500 text-lg" /> <span>Giúp các cuộc trò chuyện với nhau dễ dàng hơn</span></p>
                        <div className="flex space-x-4 mt-4">
                            <button className="shadow-lg flex space-x-2 items-center rounded-2xl bg-sky-500 px-4 py-2">
                                <FaApple className="text-5xl text-white" />
                                <div>
                                    <p className="leading-5 text-sm text-gray-200">Đã có mặt trên</p>
                                    <p className="leading-5 text-xl text-white font-semibold">App Store</p>
                                </div>
                            </button>
                            <button className="shadow-lg flex space-x-2 items-center rounded-2xl bg-sky-500 px-4 py-2">
                                <FaGooglePlay className="text-4xl text-white" />
                                <div>
                                    <p className="leading-5 text-sm text-gray-200">Đã có mặt trên</p>
                                    <p className="leading-5 text-xl text-white font-semibold">Google Play</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div>

            </div>
        </div>
    </div>
}