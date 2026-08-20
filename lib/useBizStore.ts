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
    toggleSidebar: () => void;
    sidebarCollapsed: boolean;
    setSidebarCollapsed: (collapsed: boolean) => void;
    toggleSidebarCollapsed: () => void;
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
    isInlineBarMode: boolean;
    setIsInlineBarMode: (mode: boolean) => void;
    performanceGaps: any[];
    setPerformanceGaps: (gaps: any[]) => void;
    // Shared Arkle Chat State
    arkleConversations: any[];
    setArkleConversations: (conversations: any[]) => void;
    activeConversationId: string | null;
    setActiveConversationId: (id: string | null) => void;
    arkleMessages: any[];
    setArkleMessages: (msgs: any[]) => void;
    generatedDocs: any[];
    setGeneratedDocs: (docs: any[]) => void;
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
            toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
            sidebarCollapsed: false,
            setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
            toggleSidebarCollapsed: () =>
                set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
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
            isInlineBarMode: false,
            setIsInlineBarMode: (mode) => set({ isInlineBarMode: mode }),
            performanceGaps: [],
            setPerformanceGaps: (gaps) => set({ performanceGaps: gaps }),
            
            // Shared Arkle Chat State Initializer
            arkleConversations: [
                {
                    id: 'c-1',
                    title: 'Amazon Product Launch',
                    messages: [
                        { id: 'm1', role: 'user', content: 'What are the steps for launching on Amazon?', text: 'What are the steps for launching on Amazon?', timestamp: new Date() },
                        { id: 'm2', role: 'assistant', content: 'Here is the Amazon onboarding plan: 1. Setup seller account, 2. Optimize Product SEO keywords, 3. Upload catalog.', text: 'Here is the Amazon onboarding plan: 1. Setup seller account, 2. Optimize Product SEO keywords, 3. Upload catalog.', timestamp: new Date() }
                    ],
                    timestamp: new Date(Date.now() - 3600000)
                },
                {
                    id: 'c-2',
                    title: 'GSTR-1 Tax Strategy',
                    messages: [
                        { id: 'm3', role: 'user', content: 'What is the penalty for filing late?', text: 'What is the penalty for filing late?', timestamp: new Date() },
                        { id: 'm4', role: 'assistant', content: 'Late filing penalty is ₹50/day. Let\'s file it today to avoid penalty accumulation.', text: 'Late filing penalty is ₹50/day. Let\'s file it today to avoid penalty accumulation.', timestamp: new Date() }
                    ],
                    timestamp: new Date(Date.now() - 7200000)
                }
            ],
            setArkleConversations: (conversations) => set({ arkleConversations: conversations }),
            activeConversationId: 'c-1',
            setActiveConversationId: (id) => set({ activeConversationId: id }),
            arkleMessages: [
                { id: 'm1', role: 'user', content: 'What are the steps for launching on Amazon?', text: 'What are the steps for launching on Amazon?', timestamp: new Date() },
                { id: 'm2', role: 'assistant', content: 'Here is the Amazon onboarding plan: 1. Setup seller account, 2. Optimize Product SEO keywords, 3. Upload catalog.', text: 'Here is the Amazon onboarding plan: 1. Setup seller account, 2. Optimize Product SEO keywords, 3. Upload catalog.', timestamp: new Date() }
            ],
            setArkleMessages: (msgs) => set({ arkleMessages: msgs }),
            generatedDocs: [
                { id: 'd1', name: 'Amazon_Onboarding_Audit.pdf', type: 'pdf', date: '2 hours ago' },
                { id: 'd2', name: 'GSTR-1_Filing_Summary.docx', type: 'doc', date: 'Yesterday' },
                { id: 'd3', name: 'Q2_Financial_Projections.xlsx', type: 'sheet', date: 'June 15, 2026' }
            ],
            setGeneratedDocs: (docs) => set({ generatedDocs: docs }),
        }),
        {
            name: 'bizos-operational-store',
            partialize: (state) => ({
                tasks: state.tasks,
                sidebarOpen: state.sidebarOpen,
                sidebarCollapsed: state.sidebarCollapsed,
                arkleConversations: state.arkleConversations,
                activeConversationId: state.activeConversationId,
                arkleMessages: state.arkleMessages,
                generatedDocs: state.generatedDocs,
            }),
        }
    )
);

