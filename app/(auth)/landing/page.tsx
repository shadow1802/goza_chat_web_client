import Title from "@/components/title";
import { FaApple } from "react-icons/fa";
import { FaGooglePlay } from "react-icons/fa";
import { MdDone } from "react-icons/md"

export default function Landing() {
    return <div className="flex flex-col min-h-screen bg-cover bg-left w-screen flex-1 justify-center items-center">
        <div className="flex items-center space-x-12">
            <div className="bg-gray-300 drop-shadow-lg rounded-full">
                <img src="/images/logo.png" alt="" className="w-52 h-52" />
            </div>
            <div>
                <Title size={36} />
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
    </div>
}