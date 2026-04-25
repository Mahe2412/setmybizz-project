/**
 * WebSocketService for Gemini Live API
 * Handles real-time audio streaming and bidirectional communication.
 */

export class WebSocketService {
  private ws: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private audioQueue: Float32Array[] = [];
  private isPlaying = false;
  private nextStartTime = 0;
  private onToolCall?: (fn: string, args: any) => Promise<any>;

  constructor(private apiKey: string, onToolCall?: (fn: string, args: any) => Promise<any>) {
    this.onToolCall = onToolCall;
  }

  async connect(model: string = 'gemini-2.0-flash-exp') {
    const url = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BiDiGenerateContent?key=${this.apiKey}`;
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log('Gemini Live: Connected');
      this.sendSetup(model);
    };

    this.ws.onmessage = async (event) => {
      const response = JSON.parse(event.data);
      this.handleMessage(response);
    };

    this.ws.onclose = () => console.log('Gemini Live: Connection Closed');
    this.ws.onerror = (err) => console.error('Gemini Live WebSocket Error:', err);

    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  }

  private sendSetup(model: string) {
    const setupMsg = {
      setup: {
        model: `models/${model}`,
        generation_config: { response_modalities: ['AUDIO'] }
      }
    };
    this.ws?.send(JSON.stringify(setupMsg));
  }

  private handleMessage(msg: any) {
    // Handle Audio Chunks
    if (msg.serverContent?.modelDraft?.audio) {
      const audioBase64 = msg.serverContent.modelDraft.audio;
      this.enqueueAudio(audioBase64);
    }

    // Handle Tool Calls
    if (msg.toolCall) {
      this.handleToolCall(msg.toolCall);
    }

    // Handle User Interrupt
    if (msg.serverContent?.interrupted) {
      this.clearAudioQueue();
    }
  }

  private async handleToolCall(toolCall: any) {
    const { functionCalls } = toolCall;
    for (const call of functionCalls) {
      if (this.onToolCall) {
        const result = await this.onToolCall(call.name, call.args);
        const response = {
          tool_response: {
            function_responses: [{ name: call.name, response: { result }, id: call.id }]
          }
        };
        this.ws?.send(JSON.stringify(response));
      }
    }
  }

  private enqueueAudio(base64: string) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const pcmData = new Int16Array(bytes.buffer);
    const float32Data = new Float32Array(pcmData.length);
    for (let i = 0; i < pcmData.length; i++) float32Data[i] = pcmData[i] / 32768;

    this.audioQueue.push(float32Data);
    if (!this.isPlaying) this.playNext();
  }

  private async playNext() {
    if (this.audioQueue.length === 0 || !this.audioContext) {
      this.isPlaying = false;
      return;
    }

    this.isPlaying = true;
    const data = this.audioQueue.shift()!;
    const buffer = this.audioContext.createBuffer(1, data.length, 24000);
    buffer.getChannelData(0).set(data);

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);

    const startTime = Math.max(this.audioContext.currentTime, this.nextStartTime);
    source.start(startTime);
    this.nextStartTime = startTime + buffer.duration;

    source.onended = () => this.playNext();
  }

  public sendAudio(base64: string) {
    const msg = {
      realtime_input: {
        media_chunks: [{ data: base64, mime_type: 'audio/pcm;rate=16000' }]
      }
    };
    this.ws?.send(JSON.stringify(msg));
  }

  public clearAudioQueue() {
    this.audioQueue = [];
    this.isPlaying = false;
    this.nextStartTime = 0;
    // Signal cancellation to API
    this.ws?.send(JSON.stringify({ client_content: { turn_complete: true, interrupt: true } }));
  }

  public disconnect() {
    this.ws?.close();
    this.audioContext?.close();
  }
}
