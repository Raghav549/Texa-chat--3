/**
 * TEXA WebRTC Peer Connection Manager
 * Handles voice and video calling with peer connections, ICE candidates, and call management
 */

import { EventEmitter } from "events";

export interface RTCConfig {
  iceServers: RTCIceServer[];
  bundlePolicy: "balanced" | "max-bundle" | "max-compat";
  rtcpMuxPolicy: "require" | "negotiate";
}

export interface RTCIceServer {
  urls: string[];
  username?: string;
  credential?: string;
}

export interface CallState {
  callId: string;
  peerId: string;
  peerName: string;
  peerAvatar: string;
  callType: "audio" | "video";
  state: "idle" | "calling" | "ringing" | "connected" | "ended";
  startTime: number | null;
  endTime: number | null;
  isInitiator: boolean;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
}

export interface CallStats {
  callId: string;
  duration: number;
  audioCodec: string;
  videoCodec: string;
  bitrate: number;
  packetLoss: number;
  latency: number;
  jitter: number;
}

export class WebRTCManager extends EventEmitter {
  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  private callStates: Map<string, CallState> = new Map();
  private localStream: MediaStream | null = null;
  private config: RTCConfig;
  private statsInterval: any = null;

  constructor(config?: Partial<RTCConfig>) {
    super();

    this.config = {
      iceServers: [
        { urls: ["stun:stun.l.google.com:19302"] },
        { urls: ["stun:stun1.l.google.com:19302"] },
        { urls: ["stun:stun2.l.google.com:19302"] },
        { urls: ["stun:stun3.l.google.com:19302"] },
        { urls: ["stun:stun4.l.google.com:19302"] },
      ],
      bundlePolicy: "max-bundle",
      rtcpMuxPolicy: "require",
      ...config,
    };
  }

  /**
   * Get local media stream (audio/video)
   */
  async getLocalStream(
    callType: "audio" | "video" = "audio"
  ): Promise<MediaStream> {
    try {
      if (this.localStream) {
        return this.localStream;
      }

      const constraints =
        callType === "video"
          ? {
              audio: { echoCancellation: true, noiseSuppression: true },
              video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: "user",
              },
            }
          : {
              audio: { echoCancellation: true, noiseSuppression: true },
              video: false,
            };

      this.localStream = await navigator.mediaDevices.getUserMedia(
        constraints as any
      );

      this.emit("localStreamReady", this.localStream);

      return this.localStream;
    } catch (error) {
      this.emit("error", {
        type: "media_error",
        message: `Failed to get local stream: ${error}`,
      });
      throw error;
    }
  }

  /**
   * Stop local media stream
   */
  stopLocalStream(): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
      this.emit("localStreamStopped");
    }
  }

  /**
   * Create peer connection
   */
  private createPeerConnection(callId: string): RTCPeerConnection {
    const peerConnection = new RTCPeerConnection({
      iceServers: this.config.iceServers,
      bundlePolicy: this.config.bundlePolicy,
      rtcpMuxPolicy: this.config.rtcpMuxPolicy,
    } as any);

    // Add local stream tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, this.localStream!);
      });
    }

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.emit("iceCandidate", {
          callId,
          candidate: event.candidate,
        });
      }
    };

    // Handle connection state changes
    peerConnection.onconnectionstatechange = () => {
      const state = peerConnection.connectionState;

      if (state === "connected") {
        this.emit("callConnected", { callId });
      } else if (state === "disconnected" || state === "failed") {
        this.emit("callDisconnected", { callId });
      } else if (state === "closed") {
        this.emit("callClosed", { callId });
      }
    };

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      this.emit("remoteStreamReceived", {
        callId,
        stream: event.streams[0],
      });

      const callState = this.callStates.get(callId);
      if (callState) {
        callState.remoteStream = event.streams[0];
      }
    };

    // Handle ICE connection state
    peerConnection.oniceconnectionstatechange = () => {
      const state = peerConnection.iceConnectionState;

      if (state === "connected" || state === "completed") {
        this.emit("iceConnected", { callId });
      } else if (state === "failed") {
        this.emit("iceFailed", { callId });
      }
    };

    this.peerConnections.set(callId, peerConnection);

    return peerConnection;
  }

  /**
   * Initiate call
   */
  async initiateCall(
    callId: string,
    peerId: string,
    peerName: string,
    peerAvatar: string,
    callType: "audio" | "video" = "audio"
  ): Promise<RTCSessionDescriptionInit> {
    try {
      // Get local stream
      await this.getLocalStream(callType);

      // Create peer connection
      const peerConnection = this.createPeerConnection(callId);

      // Create call state
      const callState: CallState = {
        callId,
        peerId,
        peerName,
        peerAvatar,
        callType,
        state: "calling",
        startTime: null,
        endTime: null,
        isInitiator: true,
        localStream: this.localStream,
        remoteStream: null,
      };

      this.callStates.set(callId, callState);

      // Create offer
      const offer = await peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: callType === "video",
      });

      await peerConnection.setLocalDescription(offer);

      this.emit("callInitiated", callState);

      return offer;
    } catch (error) {
      this.emit("error", {
        type: "call_initiation_error",
        message: `Failed to initiate call: ${error}`,
      });
      throw error;
    }
  }

  /**
   * Answer call
   */
  async answerCall(
    callId: string,
    peerId: string,
    peerName: string,
    peerAvatar: string,
    callType: "audio" | "video" = "audio"
  ): Promise<RTCSessionDescriptionInit> {
    try {
      // Get local stream
      await this.getLocalStream(callType);

      // Create peer connection
      const peerConnection = this.createPeerConnection(callId);

      // Create call state
      const callState: CallState = {
        callId,
        peerId,
        peerName,
        peerAvatar,
        callType,
        state: "ringing",
        startTime: null,
        endTime: null,
        isInitiator: false,
        localStream: this.localStream,
        remoteStream: null,
      };

      this.callStates.set(callId, callState);

      // Create answer
      const answer = await peerConnection.createAnswer();

      await peerConnection.setLocalDescription(answer);

      this.emit("callAnswered", callState);

      return answer;
    } catch (error) {
      this.emit("error", {
        type: "call_answer_error",
        message: `Failed to answer call: ${error}`,
      });
      throw error;
    }
  }

  /**
   * Set remote description
   */
  async setRemoteDescription(
    callId: string,
    description: RTCSessionDescriptionInit
  ): Promise<void> {
    try {
      const peerConnection = this.peerConnections.get(callId);

      if (!peerConnection) {
        throw new Error(`Peer connection not found for call ${callId}`);
      }

      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(description)
      );

      const callState = this.callStates.get(callId);
      if (callState) {
        callState.state = "connected";
        callState.startTime = Date.now();
      }

      this.emit("remoteDescriptionSet", { callId });
    } catch (error) {
      this.emit("error", {
        type: "remote_description_error",
        message: `Failed to set remote description: ${error}`,
      });
      throw error;
    }
  }

  /**
   * Add ICE candidate
   */
  async addIceCandidate(
    callId: string,
    candidate: RTCIceCandidateInit
  ): Promise<void> {
    try {
      const peerConnection = this.peerConnections.get(callId);

      if (!peerConnection) {
        throw new Error(`Peer connection not found for call ${callId}`);
      }

      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));

      this.emit("iceCandidateAdded", { callId });
    } catch (error) {
      this.emit("error", {
        type: "ice_candidate_error",
        message: `Failed to add ICE candidate: ${error}`,
      });
    }
  }

  /**
   * Toggle audio
   */
  toggleAudio(callId: string, enabled: boolean): boolean {
    const callState = this.callStates.get(callId);

    if (!callState || !callState.localStream) {
      return false;
    }

    callState.localStream.getAudioTracks().forEach((track) => {
      track.enabled = enabled;
    });

    this.emit("audioToggled", { callId, enabled });

    return true;
  }

  /**
   * Toggle video
   */
  toggleVideo(callId: string, enabled: boolean): boolean {
    const callState = this.callStates.get(callId);

    if (!callState || !callState.localStream) {
      return false;
    }

    callState.localStream.getVideoTracks().forEach((track) => {
      track.enabled = enabled;
    });

    this.emit("videoToggled", { callId, enabled });

    return true;
  }

  /**
   * Switch camera
   */
  async switchCamera(callId: string): Promise<boolean> {
    try {
      const callState = this.callStates.get(callId);

      if (!callState || callState.callType !== "video") {
        return false;
      }

      // Get front camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      } as any);

      const videoTrack = stream.getVideoTracks()[0];

      if (!videoTrack) {
        return false;
      }

      const peerConnection = this.peerConnections.get(callId);

      if (!peerConnection) {
        return false;
      }

      const sender = peerConnection
        .getSenders()
        .find((s) => s.track?.kind === "video");

      if (sender) {
        await sender.replaceTrack(videoTrack);
      }

      this.emit("cameraSwitched", { callId });

      return true;
    } catch (error) {
      this.emit("error", {
        type: "camera_switch_error",
        message: `Failed to switch camera: ${error}`,
      });
      return false;
    }
  }

  /**
   * End call
   */
  endCall(callId: string): void {
    const peerConnection = this.peerConnections.get(callId);

    if (peerConnection) {
      peerConnection.close();
      this.peerConnections.delete(callId);
    }

    const callState = this.callStates.get(callId);

    if (callState) {
      callState.state = "ended";
      callState.endTime = Date.now();
    }

    this.emit("callEnded", { callId });
  }

  /**
   * Get call stats
   */
  async getCallStats(callId: string): Promise<CallStats | null> {
    try {
      const peerConnection = this.peerConnections.get(callId);

      if (!peerConnection) {
        return null;
      }

      const stats = await peerConnection.getStats();

      let audioCodec = "unknown";
      let videoCodec = "unknown";
      let bitrate = 0;
      let packetLoss = 0;
      let latency = 0;
      let jitter = 0;

      stats.forEach((report) => {
        if (report.type === "inboundRtp") {
          if (report.mediaType === "audio") {
            audioCodec = report.codecId || "unknown";
            packetLoss = report.packetsLost || 0;
            jitter = report.jitter || 0;
          } else if (report.mediaType === "video") {
            videoCodec = report.codecId || "unknown";
          }
        } else if (report.type === "candidatePair") {
          if (report.state === "succeeded") {
            bitrate = report.availableOutgoingBitrate || 0;
            latency = report.currentRoundTripTime || 0;
          }
        }
      });

      const callState = this.callStates.get(callId);
      const duration = callState?.startTime
        ? Date.now() - callState.startTime
        : 0;

      return {
        callId,
        duration,
        audioCodec,
        videoCodec,
        bitrate,
        packetLoss,
        latency,
        jitter,
      };
    } catch (error) {
      this.emit("error", {
        type: "stats_error",
        message: `Failed to get call stats: ${error}`,
      });
      return null;
    }
  }

  /**
   * Start monitoring call stats
   */
  startStatsMonitoring(callId: string, interval: number = 1000): void {
    if (this.statsInterval) {
      clearInterval(this.statsInterval);
    }

    this.statsInterval = setInterval(async () => {
      const stats = await this.getCallStats(callId);

      if (stats) {
        this.emit("statsUpdate", stats);
      }
    }, interval);
  }

  /**
   * Stop monitoring call stats
   */
  stopStatsMonitoring(): void {
    if (this.statsInterval) {
      clearInterval(this.statsInterval);
      this.statsInterval = null;
    }
  }

  /**
   * Get call state
   */
  getCallState(callId: string): CallState | undefined {
    return this.callStates.get(callId);
  }

  /**
   * Get all active calls
   */
  getActiveCalls(): CallState[] {
    return Array.from(this.callStates.values()).filter(
      (state) => state.state !== "ended"
    );
  }

  /**
   * Cleanup
   */
  cleanup(): void {
    this.stopLocalStream();
    this.stopStatsMonitoring();

    this.peerConnections.forEach((pc) => {
      pc.close();
    });

    this.peerConnections.clear();
    this.callStates.clear();

    this.emit("cleanup");
  }
}

// Export singleton instance
export const webrtcManager = new WebRTCManager();
