"use client";

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

export function useCardActions(disabled = false) {
  const [openId, setOpenId] = useState<string | null>(null);

  const gesture = useRef<{
    id: string;
    pointerId: number;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    function closeOnOutsidePress(event: PointerEvent) {
      const target = event.target;

      if (
        target instanceof Element &&
        target.closest("[data-card-controls]")
      ) {
        return;
      }

      setOpenId(null);
    }

    document.addEventListener("pointerdown", closeOnOutsidePress);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePress);
    };
  }, []);

  function startSwipe(
    id: string,
    event: ReactPointerEvent<HTMLLIElement>
  ) {
    if (
      disabled ||
      !event.isPrimary ||
      event.button !== 0 ||
      (event.target instanceof Element &&
        event.target.closest("button"))
    ) {
      return;
    }

    gesture.current = {
      id,
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveSwipe(event: ReactPointerEvent<HTMLLIElement>) {
    const start = gesture.current;

    if (disabled || !start || start.pointerId !== event.pointerId) {
      return;
    }

    const distanceX = event.clientX - start.x;
    const distanceY = event.clientY - start.y;

    if (
      Math.abs(distanceX) < 30 ||
      Math.abs(distanceX) <= Math.abs(distanceY) * 1.5
    ) {
      return;
    }

    if (distanceX < 0) {
      setOpenId(start.id);
    } else {
      setOpenId((current) => current === start.id ? null : current);
    }

    endSwipe();
  }

  function endSwipe() {
    gesture.current = null;
  }

  return {
    openId,
    setOpenId,
    startSwipe,
    moveSwipe,
    endSwipe,
  };
}