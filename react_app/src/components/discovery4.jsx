import React, { useEffect } from 'react';

const Discovery4 = ({ content }) => {
    useEffect(() => {
        // Dynamically add the GCP script
        const script = document.createElement('script');
        script.src = "https://cloud.google.com/ai/gen-app-builder/client?hl=pt_BR";
        script.async = true;
        document.body.appendChild(script);

        // Cleanup if component unmounts
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div className="home-container">
            <div className="max-w-4xl mx-auto px-4">
                <br />
                <h1 className="text-3xl font-bold mb-4">{content?.title}</h1>
                <p>{content?.description}</p>
                <br />
                <p>Link to the app:</p>
                <a href={content?.linkApp} target="_blank" rel="noopener noreferrer">{content?.linkApp}</a>
                <br />
                <br />
                <p>Link to GitHub repo:</p>
                <a href={content?.linkGH} target="_blank" rel="noopener noreferrer">{content?.linkGH}</a>
                <br />
                <br />
                <p>{content?.tech}</p>
                <br />
            </div>
        </div>
    );
};

export default Discovery4;

