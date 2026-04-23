/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useCallback, useRef } from 'react';
import { NavAction } from '../types';
import { useApp } from '../context/AppContext';

interface UseNavigationProps {
  onAction: (action: NavAction) => void;
  enabled?: boolean;
}

export const useNavigation = ({ onAction, enabled = true }: UseNavigationProps) => {
  const { settings } = useApp();
  const lastCallRef = useRef<Record<string, number>>({});
  const COOLDOWN = 200; // ms between repeated actions

  const triggerAction = useCallback((action: NavAction) => {
    const now = Date.now();
    if (now - (lastCallRef.current[action] || 0) < COOLDOWN) return;
    lastCallRef.current[action] = now;
    onAction(action);
  }, [onAction]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!enabled) return;

    switch (e.key) {
      case 'ArrowUp': triggerAction('UP'); break;
      case 'ArrowDown': triggerAction('DOWN'); break;
      case 'ArrowLeft': triggerAction('LEFT'); break;
      case 'ArrowRight': triggerAction('RIGHT'); break;
      case 'Enter': triggerAction('SELECT'); break;
      case 'Escape': triggerAction('BACK'); break;
      case 'm':
      case 'M': triggerAction('MENU'); break;
    }
  }, [triggerAction, enabled]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    
    let gamepadTicker: number;
    const pollGamepad = () => {
      const gamepads = navigator.getGamepads();
      for (const gp of gamepads) {
        if (!gp) continue;
        
        // Analog Stick Logic with Deadzone and Sensitivity
        const deadZone = settings.analogDeadZone;
        const sensitivity = settings.analogSensitivity;
        
        // Adjust axis values based on sensitivity
        const adjustedAxes = gp.axes.map(axis => axis * sensitivity);

        if (adjustedAxes[1] < -deadZone) triggerAction('UP');
        if (adjustedAxes[1] > deadZone) triggerAction('DOWN');
        if (adjustedAxes[0] < -deadZone) triggerAction('LEFT');
        if (adjustedAxes[0] > deadZone) triggerAction('RIGHT');
        
        // Dynamic Button Mapping
        const mapping = settings.controllerMapping as Record<string, number>;
        Object.entries(mapping).forEach(([action, buttonIndex]) => {
          if (gp.buttons[buttonIndex]?.pressed) {
            triggerAction(action as NavAction);
          }
        });
      }
      gamepadTicker = requestAnimationFrame(pollGamepad);
    };

    if (enabled) {
      pollGamepad(); 
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(gamepadTicker);
    };
  }, [handleKeyDown, triggerAction, enabled, settings.controllerMapping]);
};
