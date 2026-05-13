/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║  ARKLE VOICE BRIDGE  — v2.0                              ║
 * ║  Real-time Voice → Code → UI Pipeline                    ║
 * ║  Powered by: Web Speech API + Gemini Live + Tool Brain   ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * HOW IT WORKS (Voice Coding Pipeline):
 * ─────────────────────────────────────────────────────────
 *  VOICE INPUT       TRANSCRIPT       INTENT PARSE        AI BRAIN
 * [User Speaks] → [Speech-to-Text] → [Command Parser] → [Tool Brain]
 *                                                              │
 *  LIVE PREVIEW      FILE OUTPUT       CODE GEN         API CALL
 * [iframe render] ← [Files Written] ← [Forge API]  ←─────────┘
 */

// ── Types ──────────────────────────────────────────────────────────

export type VoiceMode = 'idle' | 'listening' | 'processing' | 'speaking' | 'error';

export type VoiceCommandType =
  | 'BUILD'       // "Build me an e-commerce store for sarees"
  | 'REFINE'      // "Change the header color to dark blue"
  | 'NAVIGATE'    // "Open the templates section"
  | 'DEPLOY'      // "Deploy this template"
  | 'EXPLAIN'     // "What does this code do?"
  | 'STOP'        // "Stop / Cancel"
  | 'UNKNOWN';

export interface VoiceCommand {
  type: VoiceCommandType;
  transcript: string;
  cleanedPrompt: string;   // without wake words
  confidence: number;      // 0-1 from Web Speech API
  toolHint?: string;       // guessed toolId from context
  timestamp: number;
}

export interface VoiceSessionState {
  mode: VoiceMode;
  partialTranscript: string;
  finalTranscript: string;
  commands: VoiceCommand[];
  isMuted: boolean;
  volumeLevel: number;     // 0-100 for visualizer
}

// Legacy patch types (kept for backward compat)
export interface ArklePatch {
  component: string;
  target: 'backgroundColor' | 'color' | 'fontSize' | 'borderRadius' | 'padding' | 'layout' | 'theme';
  value: string;
}

export interface StylingIntent {
  action: string;
  patches: ArklePatch[];
}

// ── Wake Word Detection ─────────────────────────────────────────────
const WAKE_WORDS = ['arkle', 'hey arkle', 'ok arkle', 'arkle please', 'arkle build', 'arkle create'];

export const detectWakeWord = (transcript: string): boolean => {
  const t = transcript.toLowerCase().trim();
  return WAKE_WORDS.some(w => t.startsWith(w));
};

export const stripWakeWord = (transcript: string): string => {
  let result = transcript.toLowerCase().trim();
  for (const w of WAKE_WORDS) {
    if (result.startsWith(w)) {
      result = result.slice(w.length).trim();
      break;
    }
  }
  // Capitalize first letter
  return result.charAt(0).toUpperCase() + result.slice(1);
};

// ── Command Intent Parser ───────────────────────────────────────────
const BUILD_KEYWORDS = [
  'build', 'create', 'make', 'generate', 'design', 'develop',
  'banao', 'bana', 'karo', 'chahiye'  // Hindi/Telugu support
];

const REFINE_KEYWORDS = [
  'change', 'update', 'modify', 'fix', 'adjust', 'improve',
  'add', 'remove', 'replace', 'move', 'resize', 'color',
  'badlo', 'theek', 'update karo'  // Hindi/Telugu support
];

const NAVIGATE_KEYWORDS = ['open', 'go to', 'show', 'navigate', 'switch', 'close'];
const DEPLOY_KEYWORDS = ['deploy', 'publish', 'launch', 'go live', 'save'];
const STOP_KEYWORDS = ['stop', 'cancel', 'nevermind', 'exit', 'quit', 'roko'];

export const parseVoiceCommand = (transcript: string): VoiceCommand => {
  const t = transcript.toLowerCase();
  const cleanedPrompt = stripWakeWord(transcript);
  
  let type: VoiceCommandType = 'UNKNOWN';
  let toolHint: string | undefined;

  // Detect command type
  if (STOP_KEYWORDS.some(k => t.includes(k))) {
    type = 'STOP';
  } else if (DEPLOY_KEYWORDS.some(k => t.includes(k))) {
    type = 'DEPLOY';
  } else if (NAVIGATE_KEYWORDS.some(k => t.includes(k))) {
    type = 'NAVIGATE';
  } else if (REFINE_KEYWORDS.some(k => t.includes(k))) {
    type = 'REFINE';
  } else if (BUILD_KEYWORDS.some(k => t.includes(k))) {
    type = 'BUILD';
  } else {
    // Default to BUILD if wakeword was used
    if (detectWakeWord(transcript)) type = 'BUILD';
  }

  // Guess tool from context
  if (t.includes('logo') || t.includes('brand')) toolHint = 'logo';
  else if (t.includes('store') || t.includes('shop') || t.includes('ecom') || t.includes('product')) toolHint = 'ecom';
  else if (t.includes('landing') || t.includes('landing page')) toolHint = 'landing';
  else if (t.includes('website') || t.includes('site')) toolHint = 'website';
  else if (t.includes('social') || t.includes('instagram') || t.includes('post')) toolHint = 'social';
  else if (t.includes('brochure') || t.includes('pamphlet')) toolHint = 'brochure';
  else if (t.includes('pitch') || t.includes('deck') || t.includes('presentation')) toolHint = 'deck';

  return {
    type,
    transcript,
    cleanedPrompt,
    confidence: 0.9,
    toolHint,
    timestamp: Date.now(),
  };
};

// ── Voice to Forge Bridge ───────────────────────────────────────────
/**
 * Main bridge: takes a voice command and triggers the Forge API.
 * This is what powers "voice coding" — speak → code is generated.
 */
export const voiceCommandToForgeRequest = async (
  command: VoiceCommand,
  currentToolId: string,
  businessContext: Record<string, any>,
  existingFiles?: any[]
): Promise<{
  triggered: boolean;
  endpoint?: string;
  payload?: Record<string, any>;
  uiAction?: string;
}> => {
  if (command.type === 'STOP') {
    return { triggered: false, uiAction: 'STOP_GENERATION' };
  }

  if (command.type === 'NAVIGATE') {
    return { triggered: false, uiAction: `NAVIGATE:${command.cleanedPrompt}` };
  }

  if (command.type === 'DEPLOY') {
    return { triggered: false, uiAction: 'DEPLOY_CURRENT' };
  }

  if (command.type === 'BUILD' || command.type === 'REFINE' || command.type === 'UNKNOWN') {
    const toolId = command.toolHint || currentToolId;
    return {
      triggered: true,
      endpoint: '/api/forge/generate',
      payload: {
        toolId,
        userPrompt: command.cleanedPrompt,
        businessContext,
        mode: command.type === 'REFINE' ? 'refine' : 'generate',
        existingFiles: existingFiles || [],
        voiceTriggered: true,
      },
      uiAction: 'START_FORGING',
    };
  }

  return { triggered: false };
};

// ── Web Speech API Manager ──────────────────────────────────────────
/**
 * Manages the browser's Web Speech API for real-time transcription.
 * Works without any external API calls — fully local recognition.
 */
// Mock/Helper for current user since this is a lib file
const getActiveUserId = () => {
    if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('sb-odmzdnlfuhwuihcufktx-auth-token');
        if (userStr) {
            try {
                const parsed = JSON.parse(userStr);
                return parsed.user?.id;
            } catch (e) { return null; }
        }
    }
    return null;
};

export class ArkleVoiceRecognizer {
  private recognition: any = null;
  private isRunning = false;

  constructor(
    private onPartial: (text: string) => void,
    private onFinal: (text: string) => void,
    private onError: (err: string) => void,
    private lang = 'en-IN'  // Supports Indian English
  ) {}

  init() {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      this.onError('Speech recognition not supported in this browser. Use Chrome.');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = this.lang;
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';
      let confidence = 0;
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        confidence = event.results[i][0].confidence;
        if (event.results[i].isFinal) final += t;
        else interim += t;
      }
      if (interim) this.onPartial(interim);
      if (final) {
        const transcript = final.trim();
        this.onFinal(transcript);
        
        // Log to Supabase for Neural Memory
        const userId = getActiveUserId();
        if (userId) {
            logVoiceCommand({
                user_id: userId,
                transcript: transcript,
                command_type: 'voice_input',
                was_processed: true,
                confidence: confidence
            });
        }
      }
    };

    this.recognition.onerror = (event: any) => {
      if (event.error !== 'no-speech') {
        this.onError(`Voice error: ${event.error}`);
      }
    };

    this.recognition.onend = () => {
      // Auto-restart for continuous listening
      if (this.isRunning) {
        try { this.recognition.start(); } catch {}
      }
    };
  }

  start() {
    this.isRunning = true;
    if (this.recognition) {
      try { this.recognition.start(); } catch {}
    }
  }

  stop() {
    this.isRunning = false;
    if (this.recognition) {
      try { this.recognition.stop(); } catch {}
    }
  }

  get running() { return this.isRunning; }
}

// ── Volume Meter (for animated waveform in UI) ──────────────────────
export class ArkleVolumeMeter {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;
  private animFrame: number | null = null;

  async init(stream: MediaStream, onVolume: (level: number) => void) {
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

    const source = this.audioContext.createMediaStreamSource(stream);
    source.connect(this.analyser);

    const tick = () => {
      if (!this.analyser || !this.dataArray) return;
      this.analyser.getByteFrequencyData(this.dataArray);
      const avg = this.dataArray.reduce((a, b) => a + b, 0) / this.dataArray.length;
      onVolume(Math.round(avg));
      this.animFrame = requestAnimationFrame(tick);
    };
    tick();
  }

  destroy() {
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
    this.audioContext?.close();
  }
}

// ── Legacy API (backward compat) ────────────────────────────────────
export const parseVoiceIntent = (transcript: string): ArklePatch[] => {
  const patches: ArklePatch[] = [];
  const p = transcript.toLowerCase();
  if (p.includes('dark mode') || p.includes('dark theme')) {
    patches.push(
      { component: 'Global', target: 'theme', value: 'dark' },
      { component: 'Body', target: 'backgroundColor', value: '#0f172a' },
      { component: 'Text', target: 'color', value: '#f8fafc' }
    );
  }
  if (p.includes('bigger') || p.includes('larger')) {
    patches.push({ component: 'Text', target: 'fontSize', value: '1.25rem' });
  }
  const colorMatch = p.match(/make the (header|footer|background|button) (red|blue|green|black|white|yellow|purple|pink)/);
  if (colorMatch) {
    const colorMap: Record<string, string> = {
      red: '#ef4444', blue: '#3b82f6', green: '#22c55e',
      black: '#000', white: '#fff', yellow: '#eab308',
      purple: '#a855f7', pink: '#ec4899'
    };
    patches.push({
      component: colorMatch[1].charAt(0).toUpperCase() + colorMatch[1].slice(1),
      target: 'backgroundColor',
      value: colorMap[colorMatch[2]] || colorMatch[2]
    });
  }
  return patches;
};

export const generateArklePatchSummary = (patches: ArklePatch[]) =>
  JSON.stringify(patches, null, 2);
