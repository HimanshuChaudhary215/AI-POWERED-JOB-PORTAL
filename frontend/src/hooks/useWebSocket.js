import { useEffect, useRef } from "react";

export default function useWebSocket(path, onMessage, { token } = {}) {
  const wsRef = useRef(null);

  useEffect(() => {
    // build ws URL from current host or env
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const host = process.env.REACT_APP_WS_HOST || window.location.host;
    const url = `${protocol}://${host}/ws/${path}/`;

    // include token in query param
    const urlWithToken = token ? `${url}?token=${token}` : url;

    const ws = new WebSocket(urlWithToken);
    wsRef.current = ws;

    ws.onopen = () => console.log("WS open", urlWithToken);
    ws.onmessage = (evt) => {
      let data;
      try { data = JSON.parse(evt.data); } catch (e) { data = evt.data; }
      if (onMessage) onMessage(data);
    };
    ws.onerror = (err) => console.error("WS error", err);
    ws.onclose = () => console.log("WS closed");

    return () => ws.close();
  }, [path, token, onMessage]);

  return wsRef;
}
