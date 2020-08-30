import React from "react";

const messageHandler = (participantsFromRef, staleParticipants) => {
  console.log(
    "participantsFromRef",
    participantsFromRef,
    "staleParticipants",
    staleParticipants
  );
};

export default function ConferencingRoom() {
  const [participants, setParticipants] = React.useState(1);
  const participantsRef = React.useRef(participants);
  const handlerRef = React.useRef();
  React.useEffect(() => {
    participantsRef.current = participants;
  });

  React.useEffect(() => {
    handlerRef.current = message => {
      // eslint will complain about "participants" since it isn't in the
      // dependency array.
      messageHandler(participantsRef.current, participants);
    };
  }, []);

  return (
    <div id="meetingRoom">
      Participants: {participants}
      <br />
      <button onClick={() => setParticipants(prev => prev + 1)}>
        Change Participants
      </button>
      <button onClick={() => handlerRef.current()}>Send message</button>
    </div>
  );
}