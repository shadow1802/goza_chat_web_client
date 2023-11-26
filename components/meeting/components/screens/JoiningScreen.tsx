// @ts-nocheck
import React, { useEffect, useMemo, useRef, useState } from "react";
import { MeetingDetailsScreen } from "../MeetingDetailsScreen";
import { createMeeting, getToken, validateMeeting } from "../../api";
import { AiFillAlert } from "react-icons/ai"
import SettingDialogueBox from "../SettingDialogueBox";
import ConfirmBox from "../ConfirmBox";
import { Constants } from "@videosdk.live/react-sdk";
import useIsMobile from "../../hooks/useIsMobile";
import { createPopper } from "@popperjs/core";
import WebcamOffIcon from "../../icons/WebcamOffIcon";
import WebcamOnIcon from "../../icons/Bottombar/WebcamOnIcon";
import MicOffIcon from "../../icons/MicOffIcon";
import MicOnIcon from "../../icons/Bottombar/MicOnIcon";

export function JoiningScreen({
  participantName,
  setParticipantName,
  setMeetingId,
  setToken,
  setSelectedMic,
  setSelectedWebcam,
  onClickStartMeeting,
  micEnabled,
  webcamEnabled,
  setWebcamOn,
  setMicOn,
}: {
  participantName: string,
  setParticipantName: (name: string) => void,
  setMeetingId: (name: string) => void,
  setToken: (token: string) => void,
  setSelectedMic: (mic: { id: string }) => void,
  setSelectedWebcam: (webcam: { id: string }) => void,
  onClickStartMeeting: () => void,
  micEnabled: boolean,
  webcamEnabled: boolean,
  setWebcamOn: (status: boolean) => void,
  setMicOn: (status: boolean) => void,
}) {
  const [setting, setSetting] = useState<string>("video");
  const [{ webcams, mics }, setDevices] = useState<{
    devices: MediaDeviceInfo[], webcams: MediaDeviceInfo[], mics: MediaDeviceInfo[]
  }>({
    devices: [],
    webcams: [],
    mics: [],
  })

  const [videoTrack, setVideoTrack] = useState<MediaStreamTrack | null>(null)

  const [dlgMuted, setDlgMuted] = useState(false)
  const [dlgDevices, setDlgDevices] = useState(false)

  const videoPlayerRef = useRef<any>(null)
  const popupVideoPlayerRef = useRef<any>(null)
  const popupAudioPlayerRef = useRef<any>(null)

  const videoTrackRef = useRef<any>(null)
  const audioTrackRef = useRef<any>(null)

  const audioAnalyserIntervalRef = useRef()

  const [settingDialogueOpen, setSettingDialogueOpen] = useState(false)

  const [audioTrack, setAudioTrack] = useState<MediaStreamTrack | null>(null)

  const handleClickOpen = () => {
    setSettingDialogueOpen(true);
  };

  const handleClose = (value: any) => {
    setSettingDialogueOpen(false)
  };

  const isMobile = useIsMobile();

  const webcamOn = useMemo(() => !!videoTrack, [videoTrack]);
  const micOn = useMemo(() => !!audioTrack, [audioTrack]);

  const _handleTurnOffWebcam = () => {
    const videoTrack = videoTrackRef.current;

    if (videoTrack) {
      videoTrack.pause()
      setVideoTrack(null)
      setWebcamOn(false)
    }
  };
  const _handleTurnOnWebcam = () => {
    const videoTrack = videoTrackRef.current;

    if (!videoTrack) {
      getDefaultMediaTracks({ mic: false, webcam: true });
      setWebcamOn(true);
    }
  };

  const _toggleWebcam = () => {
    const videoTrack = videoTrackRef.current;

    if (videoTrack) {
      _handleTurnOffWebcam();
    } else {
      _handleTurnOnWebcam();
    }
  };
  const _handleTurnOffMic = () => {
    const audioTrack = audioTrackRef.current;

    if (audioTrack) {
      audioTrack?.pause();

      setAudioTrack(null);
      setMicOn(false);
    }
  };
  const _handleTurnOnMic = () => {
    const audioTrack = audioTrackRef.current;

    if (!audioTrack) {
      getDefaultMediaTracks({ mic: true, webcam: false });
      setMicOn(true);
    }
  };
  const _handleToggleMic = () => {
    const audioTrack = audioTrackRef.current;

    if (audioTrack) {
      _handleTurnOffMic();
    } else {
      _handleTurnOnMic();
    }
  };

  const changeWebcam = async (deviceId: string) => {
    const currentvideoTrack = videoTrackRef.current;

    if (currentvideoTrack) {
      currentvideoTrack.pause();
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId },
    });
    const videoTracks = stream.getVideoTracks();

    const videoTrack = videoTracks.length ? videoTracks[0] : null;

    setVideoTrack(videoTrack)
  };
  const changeMic = async (deviceId: string) => {
    const currentAudioTrack = audioTrackRef.current;
    currentAudioTrack && currentAudioTrack.pause();
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { deviceId },
    });
    const audioTracks = stream.getAudioTracks();

    const audioTrack = audioTracks.length ? audioTracks[0] : null;
    clearInterval(audioAnalyserIntervalRef.current);

    setAudioTrack(audioTrack);
  };

  const getDefaultMediaTracks = async ({ mic, webcam, firstTime }: { mic: boolean, webcam: boolean, firstTime?: boolean }) => {
    if (mic) {
      const audioConstraints = {
        audio: true,
      };

      const stream = await navigator.mediaDevices.getUserMedia(
        audioConstraints
      );
      const audioTracks = stream.getAudioTracks();

      const audioTrack = audioTracks.length ? audioTracks[0] : null;

      setAudioTrack(audioTrack);
      if (firstTime) {
        setSelectedMic({
          id: audioTrack?.getSettings()?.deviceId as string,
        });
      }
    }

    if (webcam) {
      const videoConstraints = {
        video: {
          width: 1280,
          height: 720,
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(
        videoConstraints
      );
      const videoTracks = stream.getVideoTracks();

      const videoTrack = videoTracks.length ? videoTracks[0] : null;
      setVideoTrack(videoTrack);
      if (firstTime) {
        setSelectedWebcam({
          id: videoTrack?.getSettings()?.deviceId as string,
        });
      }
    }
  };

  async function startMuteListener() {
    const currentAudioTrack = audioTrackRef.current;

    if (currentAudioTrack) {
      if (currentAudioTrack.muted) {
        setDlgMuted(true);
      }

      currentAudioTrack.addEventListener("mute", (ev: any) => {
        setDlgMuted(true);
      });
    }
  }

  const getDevices = async ({ micEnabled, webcamEnabled }: { micEnabled: boolean, webcamEnabled: boolean }) => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();

      const webcams = devices.filter((d) => d.kind === "videoinput");
      const mics = devices.filter((d) => d.kind === "audioinput");

      const hasMic = mics.length > 0;
      const hasWebcam = webcams.length > 0;

      setDevices({ webcams, mics, devices });

      if (hasMic) {
        startMuteListener();
      }

      getDefaultMediaTracks({
        mic: hasMic && micEnabled,
        webcam: hasWebcam && webcamEnabled,
        firstTime: true,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (audioTrackRef?.current) {
      audioTrackRef.current = audioTrack
    }

    startMuteListener();

    return () => {
      const currentAudioTrack = audioTrackRef.current;
      currentAudioTrack && currentAudioTrack.pause();
      audioTrackRef.current = null;
    };
  }, [audioTrack]);

  useEffect(() => {
    videoTrackRef.current = videoTrack;

    var isPlaying =
      videoPlayerRef.current.currentTime > 0 &&
      !videoPlayerRef.current.paused &&
      !videoPlayerRef.current.ended &&
      videoPlayerRef.current.readyState >
      videoPlayerRef.current.HAVE_CURRENT_DATA;

    if (videoTrack) {
      const videoSrcObject = new MediaStream([videoTrack]);

      if (videoPlayerRef.current) {
        videoPlayerRef.current.srcObject = videoSrcObject;
        if (videoPlayerRef.current.pause && !isPlaying) {
          try {
            videoPlayerRef.current.play();
          } catch (err) {
            console.log("error in playing video", err);
          }
        }
      }

      setTimeout(() => {
        if (popupVideoPlayerRef.current) {
          popupVideoPlayerRef.current.srcObject = videoSrcObject;
          try {
            popupVideoPlayerRef.current.play();
          } catch (err) {
            console.log("error in playing video", err);
          }
        }
      }, 1000);
    } else {
      if (videoPlayerRef.current) {
        videoPlayerRef.current.srcObject = null;
      }
      if (popupVideoPlayerRef.current) {
        popupVideoPlayerRef.current.srcObject = null;
      }
    }
  }, [videoTrack, setting, settingDialogueOpen]);

  useEffect(() => {
    getDevices({ micEnabled, webcamEnabled });
  }, []);

  const ButtonWithTooltip = ({ onClick, onState, OnIcon, OffIcon, mic }: any) => {
    const [tooltipShow, setTooltipShow] = useState(false);
    const btnRef = useRef<any>();
    const tooltipRef = useRef<any>();

    const openTooltip = () => {
      createPopper(btnRef.current, tooltipRef.current, {
        placement: "top",
      });
      setTooltipShow(true);
    };
    const closeTooltip = () => {
      setTooltipShow(false);
    };

    return (
      <>
        <div className="">
          <button
            ref={btnRef}
            onMouseEnter={openTooltip}
            onMouseLeave={closeTooltip}
            onClick={onClick}
            className={`rounded-full min-w-auto w-11 h-11 flex items-center justify-center ${onState ? "bg-white" : "bg-red-650 text-black"
              }`}
          >
            {onState ? (
              <OnIcon fillcolor={onState ? "#050A0E" : "#fff"} />
            ) : (
              <OffIcon fillcolor={onState ? "#050A0E" : "#fff"} />
            )}
          </button>
        </div>
        <div
          style={{ zIndex: 999 }}
          className={`${tooltipShow ? "" : "hidden"
            } overflow-hidden flex flex-col items-center justify-center pb-1.5`}
          ref={tooltipRef}
        >
          <div className={"rounded-md p-1.5 bg-black "}>
            <p className="text-base text-gray-200 ">
              {onState
                ? `Tắt ${mic ? "mic" : "webcam"}`
                : `Bật ${mic ? "mic" : "webcam"}`}
            </p>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="">
      <div className="overflow-y-auto flex flex-col flex-1 h-screen bg-gray-800">
        <div className="flex flex-1 flex-col md:flex-row items-center justify-center md:m-[72px] m-16">
          <div className="container grid  md:grid-flow-col grid-flow-row ">
            <div className="grid grid-cols-12">
              <div className="md:col-span-7 2xl:col-span-6 col-span-12">
                <div className="flex items-center justify-center p-1.5 sm:p-4 lg:p-6">
                  <div className="relative w-full md:pl-4 sm:pl-10 pl-5  md:pr-4 sm:pr-10 pr-5">
                    <div className="w-full relative" style={{ height: "45vh" }}>
                      <video
                        autoPlay
                        playsInline
                        muted
                        ref={videoPlayerRef}
                        controls={false}
                        style={{
                          backgroundColor: "#1c1c1c",
                        }}
                        className={
                          "rounded-[10px] h-full w-full object-cover flex items-center justify-center flip"
                        }
                      />

                      {!isMobile ? (
                        <>
                          <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
                            {!webcamOn ? (
                              <p className="text-xl xl:text-lg 2xl:text-xl text-gray-100">
                                Camera đang bị tắt hoặc thiết bị gặp vấn đề
                              </p>
                            ) : null}
                          </div>
                        </>
                      ) : null}

                      {settingDialogueOpen ? (
                        <SettingDialogueBox
                          open={settingDialogueOpen}
                          onClose={handleClose}
                          popupVideoPlayerRef={popupVideoPlayerRef}
                          popupAudioPlayerRef={popupAudioPlayerRef}
                          changeWebcam={changeWebcam}
                          changeMic={changeMic}
                          setting={setting}
                          setSetting={setSetting}
                          webcams={webcams}
                          mics={mics}
                          setSelectedMic={setSelectedMic}
                          setSelectedWebcam={setSelectedWebcam}
                          videoTrack={videoTrack}
                          audioTrack={audioTrack}
                        />
                      ) : null}

                      <div className="absolute xl:bottom-6 bottom-4 left-0 right-0">
                        <div className="container grid grid-flow-col space-x-4 items-center justify-center md:-m-2">
                          <ButtonWithTooltip
                            onClick={_handleToggleMic}
                            onState={micOn}
                            mic={true}
                            OnIcon={MicOnIcon}
                            OffIcon={MicOffIcon}
                          />
                          <ButtonWithTooltip
                            onClick={_toggleWebcam}
                            onState={webcamOn}
                            mic={false}
                            OnIcon={WebcamOnIcon}
                            OffIcon={WebcamOffIcon}
                          />
                        </div>
                      </div>
                    </div>

                    {!isMobile && (
                      <div
                        className="m-4 absolute md:left-12 lg:left-24 xl:left-44 md:right-12 lg:right-24 xl:right-44 rounded cursor-pointer bg-darkness-500"
                        onClick={(e) => {
                          handleClickOpen();
                        }}
                      >
                        <div className="flex flex-row items-center justify-center m-1">
                          <button className="text-gray-100">
                            <AiFillAlert className="h-5 w-5" />
                          </button>
                          <p className="text-gray-100 ml-1 font-semibold text-sm">
                            Kiểm tra tình trạng thiết bị
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="md:col-span-5 2xl:col-span-6 col-span-12 md:relative">
                <div className="flex flex-1 flex-col items-center justify-center xl:m-16 lg:m-6 md:mt-9 lg:mt-14 xl:mt-20 mt-3 md:absolute md:left-0 md:right-0 md:top-0 md:bottom-0">
                  <MeetingDetailsScreen
                    participantName={participantName}
                    setParticipantName={setParticipantName}
                    videoTrack={videoTrack}
                    setVideoTrack={setVideoTrack}
                    onClickStartMeeting={onClickStartMeeting}
                    onClickJoin={async (id: string) => {
                      const token = await getToken();
                      const valid = await validateMeeting({
                        roomId: id,
                        token,
                      });

                      if (valid) {
                        setToken(token);
                        setMeetingId(id);
                        if (videoTrack) {
                          videoTrack.stop();
                          setVideoTrack(null);
                        }
                        onClickStartMeeting();
                        setParticipantName("");
                      } else alert("Invalid Meeting Id");
                    }}
                    _handleOnCreateMeeting={async () => {
                      const token = await getToken();
                      const _meetingId = await createMeeting({ token });
                      setToken(token);
                      setMeetingId(_meetingId);
                      setParticipantName("");
                      return _meetingId;
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConfirmBox
        open={dlgMuted}
        successText="OKAY"
        onSuccess={() => {
          setDlgMuted(false);
        }}
        title="System mic is muted"
        subTitle="You're default microphone is muted, please unmute it or increase audio
            input volume from system settings."
      />

      <ConfirmBox
        open={dlgDevices}
        successText="DISMISS"
        onSuccess={() => {
          setDlgDevices(false);
        }}
        title="Mic or webcam not available"
        subTitle="Please connect a mic and webcam to speak and share your video in the meeting. You can also join without them."
      />
    </div>
  );
}
