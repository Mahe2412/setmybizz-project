import { useState, useCallback, useEffect } from 'react';
import { ArklePatch, parseVoiceIntent } from '../lib/ArkleVoiceBridge';

/**
 * useArkleLiveUpdate Hook
 * Listens for Arkle output and injects live style updates into the preview.
 */
export const useArkleLiveUpdate = () => {
  const [liveStyles, setLiveStyles] = useState<Record<string, Record<string, string>>>({});

  /**
   * Applies a set of patches to the local state
   */
  const applyArklePatches = useCallback((patches: ArklePatch[]) => {
    setLiveStyles(prev => {
      const nextStyles = { ...prev };
      
      patches.forEach(patch => {
        if (!nextStyles[patch.component]) {
          nextStyles[patch.component] = {};
        }
        nextStyles[patch.component][patch.target] = patch.value;
      });
      
      return nextStyles;
    });
  }, []);

  /**
   * Process a raw transcript and apply updates
   */
  const processVoiceCommand = useCallback((transcript: string) => {
    const patches = parseVoiceIntent(transcript);
    if (patches.length > 0) {
      console.log('Arkle Live Update Injected:', patches);
      applyArklePatches(patches);
    }
  }, [applyArklePatches]);

  /**
   * Converts the nested style object into CSS variables for a specific component
   */
  const getComponentStyles = (componentName: string) => {
    const styles = liveStyles[componentName] || {};
    // Map internal targets to actual CSS properties or variables
    const cssMap: Record<string, string> = {};
    Object.entries(styles).forEach(([target, value]) => {
      // Example: target 'backgroundColor' maps to '--arkle-bg'
      const cssVarName = `--arkle-${componentName.toLowerCase()}-${target}`;
      cssMap[cssVarName] = value;
    });
    return cssMap;
  };

  return {
    liveStyles,
    applyArklePatches,
    processVoiceCommand,
    getComponentStyles
  };
};
