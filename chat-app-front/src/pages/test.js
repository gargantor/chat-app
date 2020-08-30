const onExistingParticipants = (userid, existingUsers) => {
    console.log('onExistingParticipants Called!!!!!');

    //Add local User
    const user = {
      id: userid,
      username: userName,
      published: true,
      rtcPeer: null
    };

    setParticipants({
      ...participants,
      [user.id]: user
    });

    existingUsers.forEach(function (element) {
      receiveVideo(element.id, element.name)
    })
  };

  const onReceiveVideoAnswer = (senderid, sdpAnswer) => {
    console.log('participants in Receive answer -> ', participants);
    console.log('***************')

    // participants[senderid].rtcPeer.processAnswer(sdpAnswer)
  };

  const addIceCandidate = (userid, candidate) => {
    console.log('participants in Receive canditate -> ', participants);
    console.log('***************');
    // participants[userid].rtcPeer.addIceCandidate(candidate)
  };

  const receiveVideo = (userid, username) => {
    console.log('Received Video Called!!!!');
    //Add remote User
    const user = {
      id: userid,
      username: username,
      published: false,
      rtcPeer: null
    };

    setParticipants({
      ...participants,
      [user.id]: user
    });
  };

  //Callback for setting rtcPeer after creating it in child component
  const setRtcPeerForUser = (userid, rtcPeer) => {
    setParticipants({
      ...participants,
      [userid]: {...participants[userid], rtcPeer: rtcPeer}
    });
  };

  switch (message.event) {
    case 'newParticipantArrived':
      receiveVideo(message.userid, message.username);
      break;
    case 'existingParticipants':
      onExistingParticipants(
          message.userid,
          message.existingUsers
      );
      break;
    case 'receiveVideoAnswer':
      onReceiveVideoAnswer(message.senderid, message.sdpAnswer);
      break;
    case 'candidate':
      addIceCandidate(message.userid, message.candidate);
      break;
    default:
      break;
  }
};

function ConferencingRoom() {
  const [participants, setParticipants] = React.useState({});
  console.log('Participants -> ', participants);
    const participantsRef = React.useRef(participants);
    React.useEffect(() => {
        // This effect executes on every render (no dependency array specified).
        // Any change to the "participants" state will trigger a re-render
        // which will then cause this effect to capture the current "participants"
        // value in "participantsRef.current".
        participantsRef.current = participants;
    });

  React.useEffect(() => {
    // This effect only executes on the initial render so that we aren't setting
    // up the socket repeatedly. This means it can't reliably refer to "participants"
    // because once "setParticipants" is called this would be looking at a stale
    // "participants" reference (it would forever see the initial value of the
    // "participants" state since it isn't in the dependency array).
    // "participantsRef", on the other hand, will be stable across re-renders and 
    // "participantsRef.current" successfully provides the up-to-date value of 
    // "participants" (due to the other effect updating the ref).
    const handler = (message) => {messageHandler(message, participantsRef.current, setParticipants)};
    socket.on('message', handler);
    return () => {
      socket.off('message', handler);
    }
  }, []);

  return (
      <div id="meetingRoom">
        {Object.values(participants).map(participant => (
            <Participant
                key={participant.id}
                participant={participant}
                roomName={roomName}
                setRtcPeerForUser={setRtcPeerForUser}
                sendMessage={sendMessage}
            />
        ))}
      </div>
  );
}