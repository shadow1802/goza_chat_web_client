// @ts-nocheck
"use client"

import { MeetingProvider } from "@videosdk.live/react-sdk";
import { useEffect, useState } from "react"
import { MeetingAppProvider } from "@/components/meeting/MeetingAppContextDef"
import { MeetingContainer } from "@/components/meeting/meeting/MeetingContainer"
import { LeaveScreen } from "@/components/meeting/components/screens/LeaveScreen";
import { JoiningScreen } from "@/components/meeting/components/screens/JoiningScreen"
import useAuthValue from "@/utils/useAuthValue";

function MeetingView() {
  const [token, setToken] = useState<string>("")
  const [meetingId, setMeetingId] = useState<string>("")
  const authValue = useAuthValue()
  const [participantName, setParticipantName] = useState<string>(authValue?.user.fullName ?? "")
  const [micOn, setMicOn] = useState<boolean>(true)
  const [webcamOn, setWebcamOn] = useState<boolean>(true)
  const [selectedMic, setSelectedMic] = useState<{ id: string }>({ id: '' })
  const [selectedWebcam, setSelectedWebcam] = useState<{ id: string }>({ id: '' })
  const [selectWebcamDeviceId, setSelectWebcamDeviceId] = useState<string>(selectedWebcam.id)

  const [selectMicDeviceId, setSelectMicDeviceId] = useState<string>(selectedMic.id);
  const [isMeetingStarted, setMeetingStarted] = useState<boolean>(false)
  const [isMeetingLeft, setIsMeetingLeft] = useState<boolean>(false)

  const isMobile = window.matchMedia(
    "only screen and (max-width: 768px)"
  ).matches

  useEffect(() => {
    if (isMobile) {
      window.onbeforeunload = () => {
        return "Are you sure you want to exit?";
      };
    }
  }, [isMobile]);

  return (
    <>
      {isMeetingStarted ? (
        <MeetingAppProvider
          selectedMic={selectedMic}
          selectedWebcam={selectedWebcam}
          initialMicOn={micOn}
          initialWebcamOn={webcamOn}
        >
          <MeetingProvider
            config={{
              meetingId,
              micEnabled: micOn,
              webcamEnabled: webcamOn,
              name: participantName ? participantName : "TestUser",

              multiStream: true,
            }}
            token={token}
            reinitialiseMeetingOnConfigChange={true}
            joinWithoutUserInteraction={true}
          >
            <MeetingContainer
              onMeetingLeave={() => {
                setToken("");
                setMeetingId("");
                setParticipantName("");
                setWebcamOn(false);
                setMicOn(false);
                setMeetingStarted(false);
              }}
              setIsMeetingLeft={setIsMeetingLeft}
              selectedMic={selectedMic}
              selectedWebcam={selectedWebcam}
              selectWebcamDeviceId={selectWebcamDeviceId}
              setSelectWebcamDeviceId={setSelectWebcamDeviceId}
              selectMicDeviceId={selectMicDeviceId}
              setSelectMicDeviceId={setSelectMicDeviceId}
              micEnabled={micOn}
              webcamEnabled={webcamOn}
            />
          </MeetingProvider>
        </MeetingAppProvider>
      ) : isMeetingLeft ? (
        <LeaveScreen setIsMeetingLeft={setIsMeetingLeft} />
      ) : (
        <JoiningScreen
          participantName={participantName}
          setParticipantName={setParticipantName}
          setMeetingId={setMeetingId}
          setToken={setToken}
          setMicOn={setMicOn}
          micEnabled={micOn}
          webcamEnabled={webcamOn}
          setSelectedMic={setSelectedMic}
          setSelectedWebcam={setSelectedWebcam}
          setWebcamOn={setWebcamOn}
          onClickStartMeeting={() => {
            setMeetingStarted(true);
          }}
          startMeeting={isMeetingStarted}
          setIsMeetingLeft={setIsMeetingLeft}
        />
      )}
    </>
  );
}

export default MeetingView
