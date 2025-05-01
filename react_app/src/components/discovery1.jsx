import React, { useEffect } from 'react';

const Discovery1 = ({ content }) => {
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
                <div>
                    <gen-search-widget
                        configid={content?.configid}
                        triggerid="searchWidgetTrigger">
                    </gen-search-widget>
                    <input
                        placeholder={content?.searchterm}
                        id="searchWidgetTrigger"
                        className="border px-3 py-2 mt-4 w-full"
                    />
                </div>
                <br />
            </div>
        </div>
    );
};

export default Discovery1;

