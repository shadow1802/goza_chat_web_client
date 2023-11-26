import { QuickBlox } from "quickblox/quickblox";
import { useEffect } from "react";
import { QBConfig } from "./quickblox.config";
import useAuthValue from "./useAuthValue";

function useQuickBlox() {
    const QB = new QuickBlox()
    const APPLICATION_ID = QBConfig.credentials.appId
    const AUTH_KEY = QBConfig.credentials.authKey
    const AUTH_SECRET = QBConfig.credentials.authSecret
    const ACCOUNT_KEY = QBConfig.credentials.accountKey
    const authValue = useAuthValue()

    useEffect(() => {

        login()

        QB.webrtc.onAcceptCallListener = function (session, userId, extension) {

            console.log(session, userId, extension)

        };

        QB.webrtc.onRemoteStreamListener = function (session, userID, remoteStream) {
            // attach the remote stream to DOM element
            session.attachMediaStream("remoteMedia", remoteStream);
        };

        listen()

    }, [])


    const init = () => {
        QB.init(APPLICATION_ID, AUTH_KEY, AUTH_SECRET, ACCOUNT_KEY, {
            webrtc: {
                iceServers: [
                    {
                        urls: "stun:stun.randomserver.example",
                        username: "stun_login",
                        credential: "stun_password"
                    },
                    {
                        urls: "turn:turn.randomserver.example",
                        username: "turn_login",
                        credential: "turn_password"
                    }
                ]
            }
        })
    }

    const login = () => {
        if (authValue?.user?.quickBlox?.login && authValue?.user?.quickBlox?.password) {
            QB.createSession(() => {
                QB.login({ login: authValue?.user?.quickBlox?.login, password: authValue?.user?.quickBlox?.password }, (err, res) => {
                    if (err) console.log(err)
                    console.log(res)
                })
            })
        }
    }

    const makeCall = async () => {
        init()
        try {
            const userIds = [139089903, 139089904]

            const session = QB.webrtc.createNewSession(userIds, 2)

            const mediaParams = {
                audio: true,
                video: false,
                options: {
                    muted: false,
                },
                elemId: "localMedia",
            };

            session.getUserMedia(mediaParams, function (error, stream) {
                if (error) {
                    console.log(error)
                } else {

                    if (stream) { session.attachMediaStream('localMedia', stream) }

                    const extension = {}
                    session.call(extension)
                }
            })

        } catch (error) {
            console.log(error)
        }
    }

    const listen = async () => {

        QB.webrtc.onCallListener = function (session, extension) {

            const mediaParams = {
                audio: true,
                video: false,
                options: {
                    muted: false,
                },
                elemId: "localMedia",
            };

            console.log("get call...")

            session.getUserMedia(mediaParams, function (error, stream) {
                if (error) {
                } else {
                    //run accept function here
                    console.log("accept function")
                    const extension = {};
                    session.accept(extension)
                }
            });

        };
    }

    return { QB, init, login, makeCall, listen }
}

export default useQuickBlox