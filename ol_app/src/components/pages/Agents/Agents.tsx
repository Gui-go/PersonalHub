import { useRouter } from 'next/router';
import Image from 'next/image';

// Example content for demo - replace with props or data fetching
const content = {
  title: 'AI Agents',
  description: 'Explore the latest AI agents and their capabilities.',
  image: '/images/agents-banner.jpg',
  aiagents: [
    {
      id: 'agent1',
      title: 'Virtual Guigo',
      path: '/agents/virtual-guigo',
      image: '/images/agent1-thumb.jpg',
      excerpt: 'A personalized AI agent tailored to help with migration research...',
    },
    {
      id: 'agent2',
      title: 'Discovery Agent',
      path: '/agents/discovery-agent',
      image: '/images/agent2-thumb.jpg',
      excerpt: 'This agent assists in discovering relevant academic resources dynamically...',
    },
    // Add more agents here
  ],
};

export default function AgentsPage() {
  const router = useRouter();
  const AIagents = content.aiagents || [];

  return (
    <div className="container mx-auto px-4 py-8 xs:py-10 sm:py-12 md:py-16 bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
        <div className="relative">
          <Image
            src={content.image}
            alt={`${content.title} banner`}
            width={1920}
            height={400}
            className="w-full h-40 xs:h-48 sm:h-56 md:h-64 object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <h2 className="absolute bottom-4 left-4 text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            {content.title}
          </h2>
        </div>
        <div className="p-6 xs:p-8 sm:p-10 md:p-12">
          <p className="text-gray-600 text-base xs:text-lg sm:text-xl md:text-2xl leading-relaxed mb-6 xs:mb-8 sm:mb-10">
            {content.description}
          </p>
          {AIagents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {AIagents.map((agent) => (
                <div
                  key={agent.id}
                  className="bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer animate-fade-in"
                  onClick={() => router.push(agent.path)}
                >
                  <Image
                    src={agent.image}
                    alt={`${agent.title} thumbnail`}
                    width={500}
                    height={300}
                    className="w-full h-32 xs:h-40 sm:h-48 object-cover rounded-md mb-4"
                  />
                  <h4 className="text-lg xs:text-xl sm:text-2xl font-semibold text-gray-700 mb-2">{agent.title}</h4>
                  <p className="text-gray-600 text-sm xs:text-base sm:text-lg mb-4">
                    {agent.excerpt.length > 200 ? `${agent.excerpt.slice(0, 200)}...` : agent.excerpt}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-base xs:text-lg sm:text-xl">No AI agents available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
