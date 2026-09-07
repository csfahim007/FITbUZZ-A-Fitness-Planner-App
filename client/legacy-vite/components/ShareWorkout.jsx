import { useState } from 'react';
import { useShareWorkoutMutation } from '../../api/workoutApi';

export default function ShareWorkout({ workoutId }) {
  const [shareWorkout] = useShareWorkoutMutation();
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      const { data } = await shareWorkout(workoutId);
      setShareLink(data.shareLink);
    } catch (err) {
      console.error('Failed to share workout:', err);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-4">
      <button 
        onClick={handleShare}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Generate Share Link
      </button>
      
      {shareLink && (
        <div className="mt-2 flex items-center">
          <input 
            type="text" 
            value={shareLink} 
            readOnly 
            className="border p-2 rounded-l flex-grow"
          />
          <button 
            onClick={copyToClipboard}
            className="bg-gray-200 px-4 py-2 rounded-r"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
    </div>
  );
}