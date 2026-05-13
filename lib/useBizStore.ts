"use client";
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface OperationalTask {
    id: string;
    task: string;
    indianId: string;
    status: 'Working' | 'Done' | 'Overdue' | 'Review' | 'Draft';
    owner: string;
    priority: 'Critical' | 'High' | 'Medium' | 'Low';
    deadline: string;
    arklePrediction: string;
    groupId: string;
}

interface BizState {
    tasks: OperationalTask[];
    whiteboardOpen: boolean;
    setWhiteboardOpen: (open: boolean) => void;
    addTask: (task: Partial<OperationalTask>) => void;
    updateTask: (id: string, updates: Partial<OperationalTask>) => void;
    deleteTask: (id: string) => void;
    conversationMode: boolean;
    setConversationMode: (mode: boolean) => void;
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    isVoiceActive: boolean;
    setIsVoiceActive: (active: boolean) => void;
    isMuted: boolean;
    setIsMuted: (muted: boolean) => void;
    isPaused: boolean;
    setIsPaused: (paused: boolean) => void;
    lastVoiceCommand: string | null;
    setLastVoiceCommand: (cmd: string | null) => void;
    liveTranscript: string;
    setLiveTranscript: (val: string) => void;
    performanceGaps: any[];
    setPerformanceGaps: (gaps: any[]) => void;
}

export const useBizStore = create<BizState>()(
    persist(
        (set) => ({
            tasks: [
                { id: '1', task: 'Monthly GSTR-1 Filing', indianId: 'GST: 37AAAA0000A1Z', status: 'Overdue', owner: 'Arkle (Finance)', priority: 'Critical', deadline: 'Apr 11', arklePrediction: 'Penalty risk: ₹50/day. File now.', groupId: 'legal' },
                { id: '2', task: 'LLC Incorporation (RoC)', indianId: 'PAN: BPLPXXXXG', status: 'Working', owner: 'Mahendra (CEO)', priority: 'High', deadline: 'Apr 25', arklePrediction: 'DIN approval pending. Checking MCA.', groupId: 'legal' },
                { id: '3', task: 'MSME/Udyam Registration', indianId: 'Udyam: UDYAM-AP-00-...', status: 'Done', owner: 'Arkle (Legal)', priority: 'Medium', deadline: 'Completed', arklePrediction: 'Benefits unlocked: MSME loans accessible.', groupId: 'legal' },
                { id: '4', task: 'Amazon Seller Onboarding', indianId: 'Merchant Key: ...', status: 'Review', owner: 'Arkle (Growth)', priority: 'High', deadline: 'Apr 18', arklePrediction: 'Product images optimized for SEO.', groupId: 'brand' },
            ],
            whiteboardOpen: false,
            setWhiteboardOpen: (open) => set({ whiteboardOpen: open }),
            addTask: (task) => set((state) => ({
                tasks: [
                    ...state.tasks,
                    {
                        id: Math.random().toString(36).substr(2, 9),
                        task: task.task || 'New Task',
                        indianId: task.indianId || 'ID: PENDING',
                        status: task.status || 'Draft',
                        owner: task.owner || 'Founder',
                        priority: task.priority || 'Medium',
                        deadline: task.deadline || 'TBD',
                        arklePrediction: task.arklePrediction || 'Analyzing mission context...',
                        groupId: task.groupId || 'ops',
                    }
                ]
            })),
            updateTask: (id, updates) => set((state) => ({
                tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t))
            })),
            deleteTask: (id) => set((state) => ({
                tasks: state.tasks.filter((t) => t.id !== id)
            })),
            conversationMode: false,
            setConversationMode: (mode) => set({ conversationMode: mode }),
            sidebarOpen: true,
            setSidebarOpen: (open) => set({ sidebarOpen: open }),
            isVoiceActive: false,
            setIsVoiceActive: (active) => set({ isVoiceActive: active }),
            isMuted: false,
            setIsMuted: (muted) => set({ isMuted: muted }),
            isPaused: false,
            setIsPaused: (paused) => set({ isPaused: paused }),
            lastVoiceCommand: null,
            setLastVoiceCommand: (cmd) => set({ lastVoiceCommand: cmd }),
            liveTranscript: '',
            setLiveTranscript: (val) => set({ liveTranscript: val }),
            performanceGaps: [],
            setPerformanceGaps: (gaps) => set({ performanceGaps: gaps }),
        }),
        {
            name: 'bizos-operational-store',
        }
    )
);

