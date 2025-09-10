// import React, { useEffect, useCallback, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import peer from "../services/peer";
// import { useSocket } from "../context/SocketProvider";
// import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";

// const RoomPage = () => {
//   const { roomId } = useParams();
//   const navigate = useNavigate();

//   const socket = useSocket();
//   const [remoteSocketId, setRemoteSocketId] = useState(null);
//   const [myStream, setMyStream] = useState(null);
//   const [remoteStream, setRemoteStream] = useState(null);
//   const [micOn, setMicOn] = useState(true);
//   const [camOn, setCamOn] = useState(true);

//   const getMediaStream = useCallback(async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         audio: true,
//         video: true,
//       });
//       setMyStream(stream);
//       return stream;
//     } catch (err) {
//       console.error("Media access denied:", err);
//       // Handle the error gracefully, maybe show a message to the user
//       return null;
//     }
//   }, []);

//   const addTracksToPeer = useCallback((stream) => {
//     if (stream) {
//       stream.getTracks().forEach((track) => peer.peer.addTrack(track, stream));
//     }
//   }, []);

//   useEffect(() => {
//     getMediaStream().then((stream) => {
//       if (stream) {
//         addTracksToPeer(stream);
//       }
//     });
//     // Cleanup function
//     return () => {
//       if (myStream) {
//         myStream.getTracks().forEach((track) => track.stop());
//       }
//       peer.peer.close();
//     };
//   }, [getMediaStream, addTracksToPeer, myStream]);

//   // Join room
//   useEffect(() => {
//     // Only join if roomId is available
//     if (roomId) socket.emit("room:join", { room: roomId });
//   }, [socket, roomId]);

//   // Event Handlers
//   const handleUserJoined = useCallback(
//     async ({ id }) => {
//       console.log(`User joined room: ${id}`);
//       setRemoteSocketId(id);
//       const offer = await peer.getOffer();
//       socket.emit("user:call", { to: id, offer });
//     },
//     [socket]
//   );

//   const handleIncommingCall = useCallback(
//     async ({ from, offer }) => {
//       console.log(`Incoming call from: ${from}`);
//       setRemoteSocketId(from);
//       const ans = await peer.getAnswer(offer);
//       socket.emit("call:accepted", { to: from, ans });
//     },
//     [socket]
//   );

//   const handleCallAccepted = useCallback(async ({ ans }) => {
//     await peer.setAnswer(ans);
//     console.log("Call accepted!");
//   }, []);

//   const handleNegoNeeded = useCallback(async () => {
//     if (!remoteSocketId) return;
//     const offer = await peer.getOffer();
//     socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
//   }, [remoteSocketId, socket]);

//   const handleNegoNeedIncomming = useCallback(
//     async ({ from, offer }) => {
//       const ans = await peer.getAnswer(offer);
//       socket.emit("peer:nego:done", { to: from, ans });
//     },
//     [socket]
//   );

//   const handleNegoNeedFinal = useCallback(async ({ ans }) => {
//     await peer.setAnswer(ans);
//   }, []);

//   const handleUserLeft = useCallback(() => {
//     setRemoteSocketId(null);
//     setRemoteStream(null);
//     console.log("User left the room");
//   }, []);

//   const handleTrackEvent = useCallback((ev) => {
//     setRemoteStream(ev.streams[0]);
//   }, []);

//   useEffect(() => {
//     peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
//     peer.peer.addEventListener("track", handleTrackEvent);

//     return () => {
//       peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
//       peer.peer.removeEventListener("track", handleTrackEvent);
//     };
//   }, [handleNegoNeeded, handleTrackEvent]);

//   useEffect(() => {
//     socket.on("user:joined", handleUserJoined);
//     socket.on("incomming:call", handleIncommingCall);
//     socket.on("call:accepted", handleCallAccepted);
//     socket.on("peer:nego:needed", handleNegoNeedIncomming);
//     socket.on("peer:nego:final", handleNegoNeedFinal);
//     socket.on("user:left", handleUserLeft);
//     socket.on("room:full", () => {
//       alert("Room is full! Only 2 users allowed.");
//       navigate("/");
//     });

//     return () => {
//       socket.off("user:joined", handleUserJoined);
//       socket.off("incomming:call", handleIncommingCall);
//       socket.off("call:accepted", handleCallAccepted);
//       socket.off("peer:nego:needed", handleNegoNeedIncomming);
//       socket.off("peer:nego:final", handleNegoNeedFinal);
//       socket.off("user:left", handleUserLeft);
//       socket.off("room:full");
//     };
//   }, [
//     socket,
//     handleUserJoined,
//     handleIncommingCall,
//     handleCallAccepted,
//     handleNegoNeedIncomming,
//     handleNegoNeedFinal,
//     handleUserLeft,
//     navigate,
//   ]);

//   const toggleMic = () => {
//     if (myStream) {
//       myStream.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
//       setMicOn((prev) => !prev);
//     }
//   };

//   const toggleCam = () => {
//     if (myStream) {
//       myStream.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
//       setCamOn((prev) => !prev);
//     }
//   };

//   const handleDisconnect = () => {
//     if (myStream) myStream.getTracks().forEach((t) => t.stop());
//     socket.emit("room:leave", { room: roomId });
//     navigate("/");
//   };

//   return (
//     <div className="relative h-screen bg-gray-900 text-white">
//       <div className="relative w-full h-full md:flex md:flex-row">
//         {/* Remote Stream */}
//         <div className="w-full h-full md:w-1/2">
//           {remoteStream ? (
//             <video
//               ref={(v) => v && (v.srcObject = remoteStream)}
//               autoPlay
//               playsInline
//               className="w-full h-full object-cover"
//             />
//           ) : (
//             <div className="flex items-center justify-center w-full h-full">
//               <span className="text-xl text-gray-400">Waiting for user...</span>
//             </div>
//           )}
//         </div>

//         {/* My Stream */}
//         <div className="absolute top-4 right-4 md:static md:w-1/2 md:h-full z-10">
//           {myStream && (
//             <video
//               ref={(v) => v && (v.srcObject = myStream)}
//               autoPlay
//               muted
//               playsInline
//               className="w-28 h-40 rounded-lg border border-gray-700 object-cover shadow-lg md:w-full md:h-full md:rounded-none md:border-none md:shadow-none"
//             />
//           )}
//         </div>
//       </div>

//       {/* Control bar */}
//       <div className="fixed bottom-0 left-0 w-full flex flex-col items-center p-4 bg-black/70 md:bg-transparent md:static md:flex-row md:justify-center md:gap-6 md:p-4">
//         <div className="md:hidden flex justify-around w-full">
//           <button onClick={toggleMic} className="p-3 rounded-full bg-gray-700 hover:bg-gray-600">
//             {micOn ? <Mic /> : <MicOff className="text-red-500" />}
//           </button>
//           <button onClick={toggleCam} className="p-3 rounded-full bg-gray-700 hover:bg-gray-600">
//             {camOn ? <Video /> : <VideoOff className="text-red-500" />}
//           </button>
//           <button onClick={handleDisconnect} className="p-3 rounded-full bg-red-600 hover:bg-red-500">
//             <PhoneOff />
//           </button>
//         </div>

//         <div className="hidden md:flex justify-center items-center gap-6 p-4">
//           <button onClick={toggleMic} className="p-3 rounded-full bg-gray-700 hover:bg-gray-600">
//             {micOn ? <Mic /> : <MicOff className="text-red-500" />}
//           </button>
//           <button onClick={toggleCam} className="p-3 rounded-full bg-gray-700 hover:bg-gray-600">
//             {camOn ? <Video /> : <VideoOff className="text-red-500" />}
//           </button>
//           <button onClick={handleDisconnect} className="p-3 rounded-full bg-red-600 hover:bg-red-500">
//             <PhoneOff />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RoomPage;




import React, { useEffect, useCallback, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import peer from "../services/peer";
import { useSocket } from "../context/SocketProvider";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";

const RoomPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  // ✅ UPDATED: A single useEffect for media stream and peer connection setup
  useEffect(() => {
    let activeStream = null;
    let peerInstance = peer.peer;

    const startStreamAndAddTracks = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        setMyStream(stream);
        activeStream = stream;

        // Check if the peer connection is valid before adding tracks
        if (peerInstance && peerInstance.signalingState !== 'closed') {
          stream.getTracks().forEach((track) => peerInstance.addTrack(track, stream));
        } else {
          console.error("Peer connection is closed. Cannot add tracks.");
        }
      } catch (err) {
        console.error("Media access denied:", err);
      }
    };

    startStreamAndAddTracks();

    // Cleanup function: runs on component unmount (or re-render)
    return () => {
      console.log('Cleaning up RoomPage resources...');
      // Stop media tracks
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
      // Close peer connection
      if (peerInstance && peerInstance.signalingState !== 'closed') {
        peerInstance.close();
      }
    };
  }, []);

  // ✅ UPDATED: Only join the room if both socket and roomId are available
  useEffect(() => {
    if (socket && roomId) {
      socket.emit("room:join", { room: roomId });
    }
  }, [socket, roomId]);

  // ✅ UPDATED: Event Handlers wrapped with useCallback
  const handleUserJoined = useCallback(
    async ({ id }) => {
      setRemoteSocketId(id);
      const offer = await peer.getOffer();
      socket.emit("user:call", { to: id, offer });
    },
    [socket]
  );

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const handleCallAccepted = useCallback(async ({ ans }) => {
    await peer.setAnswer(ans);
  }, []);

  const handleNegoNeeded = useCallback(async () => {
    if (!remoteSocketId) return;
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setAnswer(ans);
  }, []);

  const handleUserLeft = useCallback(() => {
    setRemoteSocketId(null);
    setRemoteStream(null);
  }, []);

  const handleTrackEvent = useCallback((ev) => {
    setRemoteStream(ev.streams[0]);
  }, []);

  // ✅ UPDATED: Consolidated socket and peer event listeners
  useEffect(() => {
    // Socket events
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);
    socket.on("user:left", handleUserLeft);
    socket.on("room:full", () => {
      alert("Room is full! Only 2 users allowed.");
      navigate("/");
    });

    // Peer events
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    peer.peer.addEventListener("track", handleTrackEvent);

    return () => {
      // Socket event cleanup
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
      socket.off("user:left", handleUserLeft);
      socket.off("room:full");

      // Peer event cleanup
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
      peer.peer.removeEventListener("track", handleTrackEvent);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
    handleUserLeft,
    handleNegoNeeded,
    handleTrackEvent,
    navigate,
  ]);

  const toggleMic = () => {
    if (myStream) {
      myStream.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
      setMicOn((prev) => !prev);
    }
  };

  const toggleCam = () => {
    if (myStream) {
      myStream.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
      setCamOn((prev) => !prev);
    }
  };

  const handleDisconnect = () => {
    if (myStream) myStream.getTracks().forEach((t) => t.stop());
    socket.emit("room:leave", { room: roomId });
    navigate("/");
  };

  return (
    <div className="relative h-screen bg-gray-900 text-white">
      <div className="relative w-full h-full md:flex md:flex-row">
        {/* Remote Stream */}
        <div className="w-full h-full md:w-1/2">
          {remoteStream ? (
            <video
              ref={(v) => v && (v.srcObject = remoteStream)}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <span className="text-xl text-gray-400">Waiting for user...</span>
            </div>
          )}
        </div>

        {/* My Stream */}
        <div className="absolute top-4 right-4 md:static md:w-1/2 md:h-full z-10">
          {myStream && (
            <video
              ref={(v) => v && (v.srcObject = myStream)}
              autoPlay
              muted
              playsInline
              className="w-28 h-40 rounded-lg border border-gray-700 object-cover shadow-lg md:w-full md:h-full md:rounded-none md:border-none md:shadow-none"
            />
          )}
        </div>
      </div>

      {/* Control bar */}
      <div className="fixed bottom-0 left-0 w-full flex flex-col items-center p-4 bg-black/70 md:bg-transparent md:static md:flex-row md:justify-center md:gap-6 md:p-4">
        <div className="md:hidden flex justify-around w-full">
          <button onClick={toggleMic} className="p-3 rounded-full bg-gray-700 hover:bg-gray-600">
            {micOn ? <Mic /> : <MicOff className="text-red-500" />}
          </button>
          <button onClick={toggleCam} className="p-3 rounded-full bg-gray-700 hover:bg-gray-600">
            {camOn ? <Video /> : <VideoOff className="text-red-500" />}
          </button>
          <button onClick={handleDisconnect} className="p-3 rounded-full bg-red-600 hover:bg-red-500">
            <PhoneOff />
          </button>
        </div>

        <div className="hidden md:flex justify-center items-center gap-6 p-4">
          <button onClick={toggleMic} className="p-3 rounded-full bg-gray-700 hover:bg-gray-600">
            {micOn ? <Mic /> : <MicOff className="text-red-500" />}
          </button>
          <button onClick={toggleCam} className="p-3 rounded-full bg-gray-700 hover:bg-gray-600">
            {camOn ? <Video /> : <VideoOff className="text-red-500" />}
          </button>
          <button onClick={handleDisconnect} className="p-3 rounded-full bg-red-600 hover:bg-red-500">
            <PhoneOff />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;