'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Talent {
  id: string;
  name: string;
  age: number;
  dob: string;
  gender: string;
  job: string;
  country: string;
  religion: string;
  salary: number;
  experience: string;
  maritalStatus: string;
  workerType: string;
  pic: string;
  cv: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function CandidateProfile() {
  const params = useParams();
  const router = useRouter();
  const [candidate, setCandidate] = useState<Talent | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCVModal, setShowCVModal] = useState(false);

  useEffect(() => {
    fetch(`/api/talents/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setCandidate(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [params.id]);

  const handleHireWithCV = () => {
    const whatsappNumber = '97455355206';
    const cvLink = `${window.location.origin}/api/cv/${candidate?.id}`;
    const message = `Hi! I'm interested in hiring ${candidate?.name} (${candidate?.job}).

📄 CV Link: ${cvLink}
🌍 Country: ${candidate?.country}
💰 Salary: ${candidate?.salary} QAR
⭐ Experience: ${candidate?.experience}
👤 Gender: ${candidate?.gender}, Age: ${candidate?.age}
💍 Marital Status: ${candidate?.maritalStatus}

Please provide more details about this candidate.`;
    
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const downloadCV = () => {
    if (candidate?.cv) {
      window.open(candidate.cv, '_blank');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#002F66] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading candidate profile...</p>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <i className="fa-solid fa-user-slash text-5xl text-gray-400 mb-4"></i>
          <p className="text-gray-500">Candidate not found</p>
          <button onClick={() => router.back()} className="mt-4 text-[#002F66] hover:underline">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button - preserves scroll position */}
        <button onClick={() => router.back()} className="flex items-center gap-2 text-[#002F66] mb-6 hover:underline transition-all">
          <i className="fa-solid fa-arrow-left"></i> Back to previous page
        </button>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#002F66] to-[#0040aa] h-32"></div>
          
          {/* Profile Content */}
          <div className="relative px-6 pb-8">
            {/* Profile Image */}
            <div className="flex justify-center -mt-16 mb-4">
              <img 
                src={candidate.pic} 
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover" 
                onError={(e) => (e.currentTarget.src = 'https://placehold.co/150x150?text=User')}
                alt={candidate.name}
              />
            </div>
            
            {/* Name and Job */}
            <h1 className="text-3xl font-bold text-center text-slate-800">{candidate.name}</h1>
            <p className="text-center text-[#002F66] font-semibold mt-1 text-lg">{candidate.job}</p>
            
            {/* Worker Type Badge */}
            <div className="flex justify-center mt-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${candidate.workerType === 'Returned Housemaids' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                {candidate.workerType === 'Returned Housemaids' ? '🔄 Returned Housemaid' : '📋 Recruitment Worker'}
              </span>
            </div>
            
            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <label className="text-gray-500 text-xs uppercase tracking-wider">Country</label>
                  <p className="font-semibold text-slate-800">{candidate.country}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <label className="text-gray-500 text-xs uppercase tracking-wider">Age / Gender</label>
                  <p className="font-semibold text-slate-800">{candidate.age} years, {candidate.gender}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <label className="text-gray-500 text-xs uppercase tracking-wider">Salary</label>
                  <p className="font-semibold text-slate-800">{candidate.salary.toLocaleString()} QAR</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <label className="text-gray-500 text-xs uppercase tracking-wider">Experience</label>
                  <p className="font-semibold text-slate-800">{candidate.experience}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <label className="text-gray-500 text-xs uppercase tracking-wider">Religion</label>
                  <p className="font-semibold text-slate-800">{candidate.religion}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <label className="text-gray-500 text-xs uppercase tracking-wider">Marital Status</label>
                  <p className="font-semibold text-slate-800">{candidate.maritalStatus}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <label className="text-gray-500 text-xs uppercase tracking-wider">Date of Birth</label>
                  <p className="font-semibold text-slate-800">{candidate.dob}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <label className="text-gray-500 text-xs uppercase tracking-wider">Worker Type</label>
                  <p className="font-semibold text-slate-800">{candidate.workerType}</p>
                </div>
              </div>
            </div>
            
            {/* Upload & Update Info */}
            <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-400 flex justify-between">
              <span><i className="fa-regular fa-calendar-plus mr-1"></i> Added: {formatDate(candidate.createdAt)}</span>
              <span><i className="fa-regular fa-calendar-check mr-1"></i> Updated: {formatDate(candidate.updatedAt || candidate.createdAt)}</span>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6 pt-4 border-t">
              {/* Download CV Button */}
              <button 
                onClick={downloadCV} 
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-download"></i> Download CV
              </button>
              
              {/* View CV Button */}
              <button 
                onClick={() => setShowCVModal(true)} 
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-eye"></i> View CV
              </button>
              
              {/* Hire Button */}
              <button 
                onClick={handleHireWithCV} 
                className="flex-1 bg-[#002F66] text-white py-3 rounded-xl font-bold hover:bg-[#002060] transition-all flex items-center justify-center gap-2"
              >
                <i className="fa-brands fa-whatsapp"></i> Hire Now
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* CV Modal */}
      {showCVModal && candidate.cv && (
        <div className="fixed inset-0 bg-black/80 z-[300] flex items-center justify-center p-4" onClick={() => setShowCVModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-bold text-slate-800">CV Preview - {candidate.name}</h3>
              <button onClick={() => setShowCVModal(false)} className="text-gray-500 hover:text-red-500 text-2xl">&times;</button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {candidate.cv.endsWith('.pdf') ? (
                <iframe src={candidate.cv} className="w-full h-full" title="CV Preview" />
              ) : (
                <img src={candidate.cv} alt="CV Preview" className="w-full" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
