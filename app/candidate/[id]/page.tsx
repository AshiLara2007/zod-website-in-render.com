'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

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
}

export default function CandidateProfile() {
  const params = useParams();
  const router = useRouter();
  const [candidate, setCandidate] = useState<Talent | null>(null);
  const [loading, setLoading] = useState(true);

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

Please provide more details about this candidate.`;
    
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!candidate) return <div className="min-h-screen flex items-center justify-center">Candidate not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-[#002F66] mb-6">
          <i className="fa-solid fa-arrow-left"></i> Back
        </button>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-[#002F66] h-32"></div>
          <div className="relative px-6 pb-6">
            <div className="flex justify-center -mt-16 mb-4">
              <img src={candidate.pic} className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover" />
            </div>
            <h1 className="text-3xl font-bold text-center text-slate-800">{candidate.name}</h1>
            <p className="text-center text-[#002F66] font-semibold mt-1">{candidate.job}</p>
            
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="space-y-4">
                <div><label className="text-gray-500 text-sm">Country</label><p className="font-semibold">{candidate.country}</p></div>
                <div><label className="text-gray-500 text-sm">Age/Gender</label><p className="font-semibold">{candidate.age} years, {candidate.gender}</p></div>
                <div><label className="text-gray-500 text-sm">Salary</label><p className="font-semibold">{candidate.salary} QAR</p></div>
                <div><label className="text-gray-500 text-sm">Experience</label><p className="font-semibold">{candidate.experience}</p></div>
              </div>
              <div className="space-y-4">
                <div><label className="text-gray-500 text-sm">Religion</label><p className="font-semibold">{candidate.religion}</p></div>
                <div><label className="text-gray-500 text-sm">Marital Status</label><p className="font-semibold">{candidate.maritalStatus}</p></div>
                <div><label className="text-gray-500 text-sm">Worker Type</label><p className="font-semibold">{candidate.workerType}</p></div>
                <div><label className="text-gray-500 text-sm">Date of Birth</label><p className="font-semibold">{candidate.dob}</p></div>
              </div>
            </div>
            
            <div className="flex gap-4 mt-8 pt-6 border-t">
              <a href={candidate.cv} target="_blank" className="flex-1 bg-gray-200 text-center py-3 rounded-xl font-bold hover:bg-gray-300 transition">
                <i className="fa-solid fa-file-pdf mr-2"></i> Download CV
              </a>
              <button onClick={handleHireWithCV} className="flex-1 bg-[#002F66] text-white py-3 rounded-xl font-bold hover:bg-[#002060] transition">
                <i className="fa-brands fa-whatsapp mr-2"></i> Hire Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
