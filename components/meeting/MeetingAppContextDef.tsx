import { useContext, createContext, useState, useEffect, useRef } from "react";

export const MeetingAppContext = createContext<any>({});

export const useMeetingAppContext = () => useContext(MeetingAppContext);

type Props = {
  children: React.ReactNode, 
  selectedMic: { id: string },
  selectedWebcam: { id: string }
  initialMicOn: boolean
  initialWebcamOn: boolean
}
export const MeetingAppProvider = (props: Props) => {
  const [raisedHandsParticipants, setRaisedHandsParticipants] = useState<any>([]);
  const [sideBarMode, setSideBarMode] = useState(null);
  const [pipMode, setPipMode] = useState(false);

  const useRaisedHandParticipants = () => {
    const raisedHandsParticipantsRef = useRef<any>();

    const participantRaisedHand = (participantId: string) => {
      const raisedHandsParticipants = [...raisedHandsParticipantsRef.current];

      const newItem = { participantId, raisedHandOn: new Date().getTime() };

      const participantFound = raisedHandsParticipants.findIndex(
        ({ participantId: pID }) => pID === participantId
      );

      if (participantFound === -1) {
        raisedHandsParticipants.push(newItem);
      } else {
        raisedHandsParticipants[participantFound] = newItem;
      }

      setRaisedHandsParticipants(raisedHandsParticipants);
    };

    useEffect(() => {
      raisedHandsParticipantsRef.current = raisedHandsParticipants;
    }, [raisedHandsParticipants]);

    const _handleRemoveOld = () => {
      const raisedHandsParticipants = [...raisedHandsParticipantsRef.current];

      const now = new Date().getTime();

      const persisted = raisedHandsParticipants.filter(({ raisedHandOn }) => {
        return parseInt(raisedHandOn) + 15000 > parseInt(String(now));
      });

      if (raisedHandsParticipants.length !== persisted.length) {
        setRaisedHandsParticipants(persisted);
      }
    };

    useEffect(() => {
      const interval = setInterval(_handleRemoveOld, 1000);

      return () => {
        clearInterval(interval);
      };
    }, []);

    return { participantRaisedHand };
  };

  return (
    <MeetingAppContext.Provider
      value={{
        // states

        raisedHandsParticipants,

        sideBarMode,
        pipMode,
        // setters

        setRaisedHandsParticipants,

        setSideBarMode,
        setPipMode,
        useRaisedHandParticipants,
      }}
    >
      {props.children}
    </MeetingAppContext.Provider>
  );
};
