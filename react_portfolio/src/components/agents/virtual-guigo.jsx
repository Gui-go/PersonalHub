import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AgVirtualGuigo = ({ content }) => {
    const navigate = useNavigate();

    // Extract the virtual-guigo agent data
    const virtualGuigoAgent = content?.aiagents?.find(agent => agent.id === 'virtual-guigo') || {};

    const pageData = {
        ...virtualGuigoAgent,
        ...content,
        title: virtualGuigoAgent.title || content?.title || 'Virtual Guigo',
        description: virtualGuigoAgent.excerpt || content?.description || 'A customized LLM Agent to present Guilherme and his research.',
        image: virtualGuigoAgent.image || content?.image || '/images/wilhelmRobotProfessor.jpg'
    };


    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://cloud.google.com/ai/gen-app-builder/client?hl=pt_BR";
        script.async = true;
        script.onload = () => console.log('Google Cloud AI script loaded successfully');
        script.onerror = () => console.error('Failed to load Google Cloud AI script');
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    return (
        <div className="container mx-auto px-4 py-4 xs:py-6 sm:py-8 md:py-12">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
                {/* Banner image and title */}
                <div className="relative">
                    <img
                        src={pageData.image}
                        alt={`${pageData.title} banner`}
                        className="w-full h-40 xs:h-48 sm:h-56 md:h-64 object-cover"
                        onError={(e) => {
                            e.target.src = '/images/wilhelmRobotProfessor.jpg';
                            console.error('Failed to load banner image:', pageData.image);
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <h2 className="absolute bottom-4 left-4 text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                        {pageData.title}
                    </h2>

                </div>
                <div className="p-4 xs:p-5 sm:p-6 md:p-8">
                    {/* Description */}
                    <p className="text-gray-600 text-sm xs:text-base sm:text-lg md:text-xl leading-relaxed mb-4 xs:mb-5 sm:mb-6 md:mb-8">
                        {pageData.description}
                        {pageData.date}
                    </p>

                    {/* Search widget section */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <h3 className="text-lg xs:text-xl sm:text-2xl font-semibold text-gray-800 mb-3">
                            Ask Virtual Guigo
                        </h3>
                        <p className="text-gray-600 text-xs xs:text-sm sm:text-base mb-4">
                            This AI assistant can answer questions about Guilherme's work, research, and projects.
                        </p>
                        
                        <div className="space-y-4">
                            <gen-search-widget
                                configId={pageData.configid || 'virtual-guigo-config'}
                                triggerId="virtualGuigoSearchTrigger"
                            />
                            <input
                                id="virtualGuigoSearchTrigger"
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ask me about Guilherme's research, projects, or experience..."
                            />
                        </div>
                    </div>

                    {/* Content section */}
                    {pageData.content && (
                        <div className="prose max-w-none text-gray-700 mb-6">
                            {pageData.content}
                        </div>
                    )}

                    {/* Suggested questions */}
                    <div className="mt-6">
                        <h4 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                            Try asking:
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button 
                                onClick={() => document.getElementById('virtualGuigoSearchTrigger').value = "What is Guilherme's Masters Thesis about?"}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs xs:text-sm px-3 py-2 rounded-md transition-colors"
                            >
                                What is Guilherme's Masters Thesis about?
                            </button>
                            <button 
                                onClick={() => document.getElementById('virtualGuigoSearchTrigger').value = "What geospatial projects has Guilherme worked on?"}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs xs:text-sm px-3 py-2 rounded-md transition-colors"
                            >
                                What geospatial projects has Guilherme worked on?
                            </button>
                            <button 
                                onClick={() => document.getElementById('virtualGuigoSearchTrigger').value = "What AI agents has Guilherme created?"}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs xs:text-sm px-3 py-2 rounded-md transition-colors"
                            >
                                What AI agents has Guilherme created?
                            </button>
                            <button 
                                onClick={() => document.getElementById('virtualGuigoSearchTrigger').value = "What programming languages does Guilherme know?"}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs xs:text-sm px-3 py-2 rounded-md transition-colors"
                            >
                                What programming languages does Guilherme know?
                            </button>
                        </div>
                    </div>

                    {/* Back to agents button */}
                    <div className="mt-8 text-center">
                        <button
                            onClick={() => navigate('/agents')}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm xs:text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Back to AI Agents
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgVirtualGuigo;


// # primeiro massa.