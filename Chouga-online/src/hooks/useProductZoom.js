import { useRef, useState } from "react";

const DEFAULT_ZOOM = 1;
const CLICK_ZOOM = 2;
const MAX_ZOOM = 2.4;
const ZOOM_STEP = 0.2;
const DRAG_THRESHOLD = 6;

function useProductZoom() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(DEFAULT_ZOOM);
  const [dragPosition, setDragPosition] = useState({
    x: 0,
    y: 0,
  });
  const [dragStart, setDragStart] = useState(null);

  const pointerStartRef = useRef(null);
  const hasDraggedRef = useRef(false);

  function resetPosition() {
    setDragPosition({
      x: 0,
      y: 0,
    });

    setDragStart(null);
    pointerStartRef.current = null;
    hasDraggedRef.current = false;
  }

  function resetZoom() {
    setZoomLevel(DEFAULT_ZOOM);
    resetPosition();
  }

  function openProduct(product) {
    setSelectedProduct(product);
    resetZoom();
  }

  function closeProduct() {
    setSelectedProduct(null);
    resetZoom();
  }

  function decreaseZoom() {
    setZoomLevel((currentZoom) => {
      const nextZoom = Math.max(
        DEFAULT_ZOOM,
        Number((currentZoom - ZOOM_STEP).toFixed(1)),
      );

      if (nextZoom === DEFAULT_ZOOM) {
        resetPosition();
      }

      return nextZoom;
    });
  }

  function increaseZoom() {
    setZoomLevel((currentZoom) =>
      Math.min(MAX_ZOOM, Number((currentZoom + ZOOM_STEP).toFixed(1))),
    );
  }

  function toggleZoom() {
    if (hasDraggedRef.current) {
      hasDraggedRef.current = false;
      return;
    }

    setZoomLevel((currentZoom) => {
      const nextZoom = currentZoom > DEFAULT_ZOOM ? DEFAULT_ZOOM : CLICK_ZOOM;

      if (nextZoom === DEFAULT_ZOOM) {
        resetPosition();
      }

      return nextZoom;
    });
  }

  function handlePointerDown(event) {
    if (zoomLevel <= DEFAULT_ZOOM) {
      return;
    }

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);

    pointerStartRef.current = {
      x: event.clientX,
      y: event.clientY,
    };

    hasDraggedRef.current = false;

    setDragStart({
      x: event.clientX - dragPosition.x,
      y: event.clientY - dragPosition.y,
    });
  }

  function handlePointerMove(event) {
    if (!dragStart || !pointerStartRef.current) {
      return;
    }

    const movedX = Math.abs(event.clientX - pointerStartRef.current.x);
    const movedY = Math.abs(event.clientY - pointerStartRef.current.y);

    if (movedX > DRAG_THRESHOLD || movedY > DRAG_THRESHOLD) {
      hasDraggedRef.current = true;
    }

    setDragPosition({
      x: event.clientX - dragStart.x,
      y: event.clientY - dragStart.y,
    });
  }

  function stopDragging(event) {
    if (event?.currentTarget?.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setDragStart(null);
    pointerStartRef.current = null;
  }

  return {
    selectedProduct,
    zoomLevel,
    dragPosition,
    openProduct,
    closeProduct,
    decreaseZoom,
    increaseZoom,
    toggleZoom,
    handlePointerDown,
    handlePointerMove,
    stopDragging,
  };
}

export default useProductZoom;
