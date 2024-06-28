import { onCLS, onINP, onFCP, onLCP, onTTFB } from "web-vitals";

const reportWebVitals = () => {
    onCLS(console.log);
    onINP(console.log);
    onFCP(console.log);
    onLCP(console.log);
    onTTFB(console.log);
};

export default reportWebVitals;
