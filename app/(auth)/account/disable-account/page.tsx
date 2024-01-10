import Container from "./container";

export default function DisableAccount() {
    return <div className="flex-grow bg-gray-100">
        <div className="w-full bg-sky-500 px-6 py-2">
            <h1 className="text-lg text-white font-semibold">Xóa tài khoản của bạn</h1>
        </div>
        <Container /> 
    </div>
}