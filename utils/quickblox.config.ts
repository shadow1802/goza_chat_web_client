export const QBConfig = {
    credentials: {
        appId: 101994,
        accountKey: "ack_kBTxYDL6sp3wz1qHBQbR",
        authKey: "ak_DmQB8BFnhVNda4C",
        authSecret: "as_xm9Em29Nt5c9G3K",
        sessionToken: "",
    },
    appConfig: {
        chatProtocol: {
            Active: 2,
        },
        debug: false,
        endpoints: {
            apiEndpoint: 'https://api.quickblox.com',
            chatEndpoint: 'chat.quickblox.com',
        },
        on: {
            async sessionExpired(handleResponse: any, retry: any) {
                console.log(`Test sessionExpired… ${handleResponse} ${retry}`);
            }
        },
        streamManagement: {
            Enable: true,
        },
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
            ],
            answerTimeInterval: 60,
            autoReject: true,
            incomingLimit: 1,
            dialingTimeInterval: 5,
            disconnectTimeInterval: 30,
            statsReportTimeInterval: false,
        },
        pingTimeout: 5,
        pingLocalhostTimeInterval: 5,
    },
    mediaParams: {
        audio: true,
        video: false,
        options: {
            muted: false,
            mirror: true,
        },
    },
    adminAccount: {
        id: 138963419,
        login: 'room1',
        fullname: 'room1',
        password: 'room1@gmail.com'
    }
};