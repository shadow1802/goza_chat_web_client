"use client"
import { QuickBlox } from "quickblox/quickblox";
// import { onAcceptCall, onListenCall, onRejectCall, onStopCall } from "./quickblox.config";
import log from "./logger";

type DataLogin = {
    ID: number
    fullName: string
    login: string
    password: string
}

export const initQuickBlox = async (QBConfig: any, dataLogin: DataLogin) => {
    // Init quickblox
    const QB = new QuickBlox()
    const APPLICATION_ID = QBConfig.credentials.appId;
    const AUTH_KEY = QBConfig.credentials.authKey;
    const AUTH_SECRET = QBConfig.credentials.authSecret;
    const ACCOUNT_KEY = QBConfig.credentials.accountKey;
    const CONFIG = QBConfig.config;
    QB.init(APPLICATION_ID, AUTH_KEY, AUTH_SECRET, ACCOUNT_KEY, CONFIG);

    QB.createSession(function(createSessionErr, createSessionResult) {
        if (createSessionErr) {
            log.error(["Không thể tạo session. Err: ", createSessionErr]);
        }
        else {
            log.success(["Tạo session thành công. Session: ", createSessionResult]);
            // Đăng nhập
            var userRequiredParams = {
                login: dataLogin.login,
                password: dataLogin.password
            };
            QB.login(userRequiredParams, function(loginErr, loginUser) {
                if (loginErr) {
                    log.error(["Đăng nhập không thành công. Err: ", loginErr])
                }
                else {
                    log.success(["Đăng nhập thành công. User: ", loginUser]);

                    // Tạo connect
                    QB.chat.connect({
                        jid: QB.chat.helpers.getUserJid(dataLogin.ID, QBConfig.credentials.appId),
                        password: dataLogin.password
                    }, function (connErr) {
                        if (connErr) {
                            log.error(["Không thể connect. Err: ", connErr]);
                        } else {
                            console.log("Connect thành công.");
                        }
                    });
                }
            });
        }
    });

    return QB;
}