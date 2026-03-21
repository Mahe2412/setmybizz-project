"use client";
import React, { useState, useEffect, useRef } from 'react';
import CenterChat from '../ai-studio/CenterChat';

export default function DraggableAiChat() {
    const [isMinimized, setIsMinimized] = useState(false);
    const [isClosed, setIsClosed] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    
    // Position tracking for drag
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragRef = useRef<{ startX: number, startY: number, startLeft: number, startTop: number } | null>(null);

    // Size tracking for resize
    const [size, setSize] = useState({ width: 450, height: 450 });
    const [isResizing, setIsResizing] = useState(false);
    const resizeRef = useRef<{ startX: number, startY: number, startWidth: number, startHeight: number } | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            // Wait until scrolled past top 150px or so to make it floating
            const mainContainer = document.getElementById('main-scroll-container');
            const scrollY = mainContainer ? mainContainer.scrollTop : window.scrollY;
            if (scrollY > 150) {
                if (!isScrolled) setIsScrolled(true);
            } else {
                if (isScrolled) setIsScrolled(false);
            }
        };

        const mainContainer = document.getElementById('main-scroll-container');
        if (mainContainer) {
            mainContainer.addEventListener('scroll', handleScroll);
        } else {
            window.addEventListener('scroll', handleScroll);
        }
        
        return () => {
            if (mainContainer) mainContainer.removeEventListener('scroll', handleScroll);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isScrolled]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging && dragRef.current) {
                const dx = e.clientX - dragRef.current.startX;
                const dy = e.clientY - dragRef.current.startY;
                setPos({
                    x: dragRef.current.startLeft + dx,
                    y: dragRef.current.startTop + dy
                });
            }
            if (isResizing && resizeRef.current) {
                const dx = e.clientX - resizeRef.current.startX;
                const dy = e.clientY - resizeRef.current.startY;
                setSize({
                    width: Math.max(300, resizeRef.current.startWidth + dx),
                    height: Math.max(300, resizeRef.current.startHeight + dy)
                });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            setIsResizing(false);
            document.body.style.userSelect = 'auto';
        };

        if (isDragging || isResizing) {
            document.body.style.userSelect = 'none';
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            document.body.style.userSelect = 'auto';
        };
    }, [isDragging, isResizing]);

    if (isClosed || isMinimized) {
        return (
            <div 
                className="fixed bottom-6 right-6 z-[100] bg-indigo-600 text-white px-5 py-3 rounded-2xl shadow-2xl cursor-pointer hover:bg-indigo-700 hover:scale-105 transition-all font-bold text-sm flex items-center gap-3 border border-indigo-500/50 backdrop-blur-md"
                onClick={() => { setIsMinimized(false); setIsClosed(false); }}
            >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
                    <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                </div>
                <span>Arkle Co-Founder</span>
                <span className="w-2 h-2 rounded-full bg-green-400"></span>
            </div>
        );
    }

    // When scrolled, we attach fixed styling. When top, inline.
    // Except, if we dragged it, we might want it fixed anyway. 
    // Let's make it fixed when isScrolled OR when user started dragging.
    const isFloating = isScrolled || pos.x !== 0 || pos.y !== 0;

    const baseClasses = isFloating 
        ? "fixed z-[100] shadow-2xl backdrop-blur-sm bg-white/95" 
        : "relative z-10 w-full max-w-4xl mx-auto shadow-lg bg-white";

    // Set border and edge effects
    const containerStyle: React.CSSProperties = isFloating ? {
        left: pos.x === 0 ? 'auto' : pos.x,
        top: pos.y === 0 ? 'auto' : pos.y,
        right: pos.x === 0 ? '30px' : 'auto',
        bottom: pos.y === 0 ? '30px' : 'auto',
        width: size.width,
        height: size.height,
        borderRadius: '1.5rem',
        border: '1px solid rgba(226, 232, 240, 0.8)'
    } : {
        height: '450px', // Medium size initially
        borderRadius: '1.5rem',
        border: '1px solid rgba(226, 232, 240, 0.8)'
    };

    return (
        <div 
            className={`${baseClasses} overflow-hidden flex flex-col transition-all duration-300 ${isDragging ? 'opacity-90 scale-105 shadow-3xl' : ''}`} 
            style={containerStyle}
        >
            {/* Draggable Header */}
            <div 
                className="bg-indigo-600 p-3 flex items-center justify-between cursor-move shrink-0 border-b border-indigo-700/50"
                onMouseDown={(e) => {
                    if (!isFloating) return; // Only allow drag when floating
                    setIsDragging(true);
                    dragRef.current = {
                        startX: e.clientX,
                        startY: e.clientY,
                        startLeft: pos.x === 0 ? window.innerWidth - 30 - size.width : pos.x, // Adjust if initial right-bottom
                        startTop: pos.y === 0 ? window.innerHeight - 30 - size.height : pos.y
                    };
                }}
            >
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-white text-lg">smart_toy</span>
                        <h3 className="font-bold text-white text-sm">Arkle Co-Founder <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full ml-1 font-black">AI</span></h3>
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse ml-2" />
                    </div>
                    {isFloating && <span className="text-[8px] text-indigo-200 mt-1 ml-6 uppercase tracking-widest font-bold">Drag to move</span>}
                </div>
                
                <div className="flex gap-2">
                    <button 
                        onClick={() => setIsMinimized(true)}
                        className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 text-white flex justify-center items-center transition-all cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-sm">remove</span>
                    </button>
                    <button 
                        onClick={() => setIsClosed(true)}
                        className="w-7 h-7 rounded-lg bg-red-400/80 hover:bg-red-500 text-white flex justify-center items-center transition-all cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                </div>
            </div>

            {/* Chat Content */}
            <div className="flex-1 overflow-hidden relative">
                {/* Wrap CenterChat completely. We pass our own minimal props. */}
                <CenterChat
                    chatId="workspace-ai-cofounder"
                    leftSidebarOpen={false}
                    rightSidebarOpen={false}
                    onToggleLeftSidebar={() => {}}
                    onToggleRightSidebar={() => {}}
                />
            </div>

            {/* Resizable handle (only when floating) */}
            {isFloating && (
                <div 
                    className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize z-50 flex items-end justify-end p-0.5 opacity-50 hover:opacity-100"
                    onMouseDown={(e) => {
                        e.stopPropagation();
                        setIsResizing(true);
                        resizeRef.current = {
                            startX: e.clientX,
                            startY: e.clientY,
                            startWidth: size.width,
                            startHeight: size.height
                        };
                    }}
                >
                    <div className="w-3 h-3 bg-indigo-500 rounded-tl-full" style={{ clipPath: 'polygon(100% 0, 0% 100%, 100% 100%)' }} />
                </div>
            )}
        </div>
    );
}
