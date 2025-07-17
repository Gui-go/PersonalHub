import { useEffect, useState } from "react";

const CookieConsentBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookie_consent");
    if (!accepted) setVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "true");
    setVisible(false);
    window.location.reload(); // Reload to inject analytics
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-800 text-white p-4 text-sm shadow-lg">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <span>
          We use cookies to analyze site usage. By clicking “Accept”, you consent to the use of analytics.
        </span>
        <button
          onClick={handleAccept}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default CookieConsentBanner;



