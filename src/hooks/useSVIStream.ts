import { useState, useEffect } from 'react';
import { mockWebSocket, WebSocketEvent } from '../lib/mockWebSocket';

export function useSVIStream() {
  const [lastEvent, setLastEvent] = useState<WebSocketEvent | null>(null);

  useEffect(() => {
    const unsubscribe = mockWebSocket.subscribe((event) => {
      setLastEvent(event);
    });

    return () => unsubscribe();
  }, []);

  return { lastEvent };
}
