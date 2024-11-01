import { useEffect, useState } from 'react';

const useWebSocket = (url) => {
    const [data, setData] = useState(null);
    const [ws, setWs] = useState(null);

    useEffect(() => {
        const newWs = new WebSocket(url);

        newWs.onopen = () => {
            console.log('WebSocket connected');
        };

        newWs.onmessage = (event) => {
            setData(JSON.parse(event.data));
        };

        newWs.onclose = () => {
            console.log('WebSocket disconnected');
        };

        setWs(newWs);

        return () => {
            newWs.close();
        };
    }, [url]);

    const sendMessage = (message) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(message));
        }
    };

    return { data, sendMessage };
};

export default useWebSocket;
