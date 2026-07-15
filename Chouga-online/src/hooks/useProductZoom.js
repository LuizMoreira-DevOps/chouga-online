import { useState } from "react";

function useProductZoom() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [zoomLevel, setZoomLevel] = useState(1);

  const [dragPosition, setDragPosition] = useState({
    x: 0,
    y: 0,
  });

  const [dragStart, setDragStart] = useState(null);

  function resetZoom() {
    setZoomLevel(1);

    setDragPosition({
      x: 0,
      y: 0,
    });

    setDragStart(null);
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
    setZoomLevel((currentZoom) =>
      Math.max(1, Number((currentZoom - 0.2).toFixed(1))),
    );
  }

  function increaseZoom() {
    setZoomLevel((currentZoom) =>
      Math.min(2.4, Number((currentZoom + 0.2).toFixed(1))),
    );
  }

  function handlePointerDown(event) {
    event.preventDefault();

    event.currentTarget.setPointerCapture(event.pointerId);

    setDragStart({
      x: event.clientX - dragPosition.x,
      y: event.clientY - dragPosition.y,
    });
  }

  function handlePointerMove(event) {
    if (!dragStart) {
      return;
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
  }

  return {
    selectedProduct,
    zoomLevel,
    dragPosition,
    openProduct,
    closeProduct,
    decreaseZoom,
    increaseZoom,
    handlePointerDown,
    handlePointerMove,
    stopDragging,
  };
}

export default useProductZoom;
