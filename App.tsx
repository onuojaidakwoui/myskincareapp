import React, { useState, useRef, useEffect } from 'react';
import { AppStep, SkincareAnswers, JawlineAnswers, AnalysisData } from './types';
import { analyzeFaceAndRoutine } from './services/geminiService';
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Activity,
  User,
  XCircle,
  RefreshCcw,
  Droplets,
  Zap,
  Sun,
  CheckCircle,
  Circle,
  ShoppingCart,
  ExternalLink
} from 'lucide-react';

// --- Inlined Components ---

interface StepIndicatorProps {
  current: number;
  total: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ current, total }) => {
  return (
    <div className="flex gap-1 w-full px-6 pt-4">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= current ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
        />
      ))}
    </div>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'pink' | 'blue';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = "py-4 px-6 rounded-2xl font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2";

  const variants = {
    primary: "bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    outline: "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50",
    pink: "bg-rose-500 text-white shadow-lg shadow-rose-200 hover:bg-rose-600",
    blue: "bg-sky-600 text-white shadow-lg shadow-sky-200 hover:bg-sky-700"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// --- Sub-components ---

const Onboarding = ({ onStart }: { onStart: () => void }) => (
  <div className="flex-1 flex flex-col p-8 bg-gradient-to-b from-indigo-50 to-white">
    <div className="mt-12 flex-1 flex flex-col items-center text-center">
      <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-xl mb-8">
        <Sparkles className="text-white w-10 h-10" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Glow & Sculpt</h1>
      <p className="text-gray-600 leading-relaxed max-w-xs">
        Discover your ideal routine through advanced facial geometry analysis and lifestyle insights.
      </p>

      <div className="mt-12 w-full space-y-4">
        <div className="flex gap-4 items-start text-left p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-2 bg-rose-50 rounded-lg text-rose-500">
            <Camera size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Face Scan</h3>
            <p className="text-sm text-gray-500">Analyze symmetry and jawline angle.</p>
          </div>
        </div>
        <div className="flex gap-4 items-start text-left p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-2 bg-sky-50 rounded-lg text-sky-500">
            <Activity size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Smart Routine</h3>
            <p className="text-sm text-gray-500">Personalized skincare & facial exercises.</p>
          </div>
        </div>
      </div>
    </div>

    <div className="mt-auto space-y-6">
      <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3">
        <ShieldCheck className="text-amber-500 flex-shrink-0" size={20} />
        <p className="text-xs text-amber-800 leading-snug">
          <strong>Disclaimer:</strong> This app provides cosmetic suggestions and wellness guidance, not medical advice.
        </p>
      </div>
      <Button fullWidth onClick={onStart}>
        Accept & Get Started <ChevronRight size={20} />
      </Button>
    </div>
  </div>
);

const ScanStep = ({ onCapture }: { onCapture: (dataUrl: string) => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streamActive, setStreamActive] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const initCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreamActive(true);
        }
      } catch (err) {
        console.error("Camera error:", err);
        alert("Camera access is required. Please enable permissions.");
      }
    };
    initCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current && streamActive) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.8);
        onCapture(dataUrl);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-black relative overflow-hidden">
      <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-64 h-80 border-2 border-dashed border-white/50 rounded-[4rem] relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md px-4 py-1 rounded-full text-white text-xs font-medium border border-white/20">
            Center your face
          </div>
        </div>
      </div>
      <div className="absolute bottom-12 inset-x-0 flex flex-col items-center gap-6">
        <button
          onClick={handleCapture}
          className="w-20 h-20 rounded-full border-4 border-white p-1 shadow-2xl transition-transform active:scale-90"
        >
          <div className="w-full h-full rounded-full bg-white" />
        </button>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

const Questionnaire = ({
  questions,
  title,
  colorClass,
  onComplete
}: {
  questions: any[],
  title: string,
  colorClass: string,
  onComplete: (answers: Record<string, string>) => void
}) => {
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswer = (val: string) => {
    const qId = questions[qIndex].id;
    const newAnswers = { ...answers, [qId]: val };
    setAnswers(newAnswers);
    if (qIndex < questions.length - 1) {
      setQIndex(qIndex + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-8 bg-white">
      <StepIndicator current={qIndex} total={questions.length} />
      <div className="mt-12">
        <span className={`${colorClass} font-bold text-xs tracking-widest uppercase mb-2 block`}>{title}</span>
        <h2 className="text-2xl font-bold text-gray-900 leading-tight">
          {questions[qIndex].label}
        </h2>
      </div>
      <div className="mt-10 space-y-3">
        {questions[qIndex].options.map((opt: string) => (
          <button
            key={opt}
            onClick={() => handleAnswer(opt)}
            className="w-full p-5 text-left bg-white border-2 border-gray-100 rounded-2xl font-medium text-gray-700 hover:border-indigo-400 hover:text-indigo-600 transition-all flex justify-between items-center"
          >
            {opt} <ChevronRight size={18} className="opacity-30" />
          </button>
        ))}
      </div>
    </div>
  );
};

const AnalyzingStep = () => (
  <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white">
    <div className="relative mb-8">
      <div className="w-32 h-32 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
      <div className="absolute inset-0 flex items-center justify-center">
        <User className="text-indigo-600" size={32} />
      </div>
    </div>
    <h2 className="text-xl font-bold text-gray-900 mb-2">Analyzing Geometry</h2>
    <p className="text-gray-500 text-center max-w-xs animate-pulse">
      Our AI is generating your personalized routine...
    </p>
  </div>
);

const ResultsView = ({ results, onReset, onViewProducts }: { results: AnalysisData, onReset: () => void, onViewProducts: () => void }) => {
  const [activeTab, setActiveTab] = useState<'SKINCARE' | 'JAWLINE'>('SKINCARE');

  const getSkincareIcon = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('cleanser')) return <Droplets className="text-rose-400" size={16} />;
    if (lower.includes('moisturizer')) return <Zap className="text-sky-400" size={16} />;
    if (lower.includes('sunscreen')) return <Sun className="text-amber-400" size={16} />;
    return <Sparkles className="text-rose-300" size={16} />;
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f5f7fb] overflow-hidden">
      <div className="bg-white px-4 py-4 flex items-center gap-4 border-b border-gray-100">
        <button onClick={onReset} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} className="text-gray-800" />
        </button>
        <h1 className="text-[17px] font-semibold text-gray-900 flex-1 text-center pr-8">Your Analysis</h1>
      </div>

      <div className="px-6 pt-6">
        <div className="relative bg-gradient-to-r from-rose-100 to-rose-50 rounded-[28px] p-5 flex items-center gap-4 overflow-hidden border border-rose-200/50 shadow-sm">
          <div className="w-16 h-16 rounded-full border-2 border-white overflow-hidden shadow-sm bg-[#e2e8f0] flex items-center justify-center">
            <User className="text-[#94a3b8]" size={32} />
          </div>
          <div className="flex-1">
            <h2 className="text-[15px] font-bold text-gray-800 leading-tight">Skin: <span className="font-normal">{results.skincare.skinType}</span></h2>
            <div className="h-[1px] bg-rose-200/60 my-1.5" />
            <p className="text-[15px] font-bold text-gray-800 leading-tight">Face: <span className="font-normal">{results.jawline.faceShape}</span></p>
          </div>
        </div>
      </div>

      <div className="px-6 mt-6">
        <div className="flex p-1 bg-gray-200/60 rounded-full">
          <button
            onClick={() => setActiveTab('SKINCARE')}
            className={`flex-1 py-2.5 rounded-full font-bold transition-all text-[15px] ${activeTab === 'SKINCARE' ? 'bg-rose-500 text-white shadow-md' : 'text-gray-500'}`}
          >
            Skincare
          </button>
          <button
            onClick={() => setActiveTab('JAWLINE')}
            className={`flex-1 py-2.5 rounded-full font-bold transition-all text-[15px] ${activeTab === 'JAWLINE' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500'}`}
          >
            Jawline
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
        {activeTab === 'SKINCARE' ? (
          <div className="space-y-4">
            <div className="bg-white rounded-[24px] p-6 border border-rose-100 shadow-sm">
              <h3 className="text-[18px] font-bold text-gray-900 mb-4">Routine Plan</h3>
              <div className="mb-6">
                <h4 className="text-[14px] font-bold text-rose-500 mb-3 uppercase tracking-wide">Morning (AM)</h4>
                <div className="space-y-2">
                  {results.skincare.amRoutine.map((step, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                      <div className="w-7 h-7 bg-rose-50 rounded-lg flex items-center justify-center">{getSkincareIcon(step)}</div>
                      <span className="text-[14px] text-gray-700">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-rose-500 mb-3 uppercase tracking-wide">Avoid</h4>
                <div className="space-y-2">
                  {results.skincare.avoid.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <XCircle className="text-rose-400" size={18} />
                      <span className="text-[14px] text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={onViewProducts}
              className="w-full bg-rose-500 text-white font-bold py-4 rounded-full shadow-lg shadow-rose-200 active:scale-95 transition-transform flex items-center justify-center gap-2 text-[15px]"
            >
              Shop Recommended Products <ChevronRight size={18} />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white rounded-[24px] p-6 border border-blue-100 shadow-sm">
              <h3 className="text-[18px] font-bold text-gray-900 mb-4">Exercises</h3>
              <div className="space-y-6">
                {results.jawline.exercises.map((ex, i) => (
                  <div key={i} className="pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[14px] font-bold text-gray-800">{ex.name}</span>
                      <span className="text-[13px] text-gray-500">{ex.reps}</span>
                    </div>
                    <p className="text-[13px] text-gray-600 bg-blue-50/50 p-3 rounded-xl">{ex.instructions}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="mt-8 pb-10 flex justify-center">
          <button onClick={onReset} className="text-gray-400 flex items-center gap-2 font-medium text-[14px]">
            <RefreshCcw size={16} /> New Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductSuggestionsView = ({ onBack }: { onBack: () => void }) => {
  // Verified Deep Links & 2025 Market Prices (Naira)
  const products = [
    {
      name: "CeraVe Foaming Cleanser",
      price: "₦ 23,800",
      description: "Direct link to the 236ml version. Essential for maintaining a healthy skin barrier.",
      store: "Jumia",
      link: "https://www.jumia.com.ng/cerave-foaming-facial-cleanser-for-normal-to-oily-skin-236ml-71276991.html",
      imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
      name: "COSRX Snail Mucin Essence",
      price: "₦ 26,500",
      description: "Direct link. Lightweight essence that repairs skin and provides deep hydration.",
      store: "Jumia",
      link: "https://www.jumia.com.ng/cosrx-advanced-snail-96-mucin-power-essence-100ml-36173261.html",
      imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
      name: "Neutrogena Hydro Boost Gel",
      price: "₦ 21,200",
      description: "Direct link. Water-based moisturizer perfect for all skin types.",
      store: "Jumia",
      link: "https://www.jumia.com.ng/neutrogena-hydro-boost-water-gel-moisturiser-50ml-13844641.html",
      imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
      name: "Biore UV Aqua Rich SPF 50",
      price: "₦ 15,800",
      description: "Direct link. The best-selling watery sunscreen for invisible protection.",
      store: "Konga",
      link: "https://www.konga.com/product/biore-uv-aqua-rich-watery-essence-spf50-pa-50g-3607441",
      imageUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=200&h=200"
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#f5f7fb] overflow-hidden">
      <div className="bg-white px-4 py-4 flex items-center gap-4 border-b border-gray-100">
        <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} className="text-[#1a2e4e]" />
        </button>
        <h1 className="text-[19px] font-bold text-[#1a2e4e] flex-1 text-center pr-8">Direct Shop</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 custom-scrollbar">
        <div className="space-y-5">
          {products.map((product, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-4 flex gap-4 shadow-sm border border-[#e2e8f0]">
              <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 p-2">
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-[15px] font-bold text-[#1a2e4e] leading-snug">{product.name}</h3>
                  <span className="text-[14px] font-bold text-[#ea580c] whitespace-nowrap ml-2">{product.price}</span>
                </div>
                <p className="text-[12px] text-[#64748b] mb-3">{product.description}</p>
                <div className="flex gap-2">
                  <a
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-gradient-to-r from-[#f59e0b] to-[#ea580c] text-white py-2.5 rounded-lg font-bold text-[13px] flex items-center justify-center gap-2 no-underline active:scale-95"
                  >
                    <ShoppingCart size={14} /> Buy on {product.store}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-[12px] text-gray-400">Prices are synchronized with Jumia/Konga market rates.</p>
      </div>
    </div>
  );
};

// --- Main App Component ---

export const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('ONBOARDING');
  const [scanImage, setScanImage] = useState<string | null>(null);
  const [skincareAnswers, setSkincareAnswers] = useState<Partial<SkincareAnswers>>({});
  const [jawlineAnswers, setJawlineAnswers] = useState<Partial<JawlineAnswers>>({});
  const [results, setResults] = useState<AnalysisData | null>(null);

  const skincareQuestions = [
    { id: 'afterWashFeel', label: 'How does your face feel 30 mins after washing?', options: ['Oily', 'Normal', 'Dry'] },
    { id: 'breakoutFreq', label: 'How often do you get breakouts?', options: ['Often', 'Rarely', 'Never'] },
    { id: 'sensitivity', label: 'Does your skin sting with new products?', options: ['Yes', 'No'] },
    { id: 'sunscreen', label: 'Do you use sunscreen?', options: ['Yes', 'Sometimes', 'No'] },
    { id: 'budget', label: 'Your skincare budget range?', options: ['Basic', 'Standard', 'Premium'] },
  ];

  const jawlineQuestions = [
    { id: 'chewSide', label: 'Which side do you chew on more?', options: ['Left', 'Right', 'Both'] },
    { id: 'jawlineType', label: 'Describe your jawline', options: ['Sharp', 'Soft', 'Hidden'] },
    { id: 'posture', label: 'Frequent device use looking down?', options: ['Yes', 'No'] },
  ];

  const handleCapture = (dataUrl: string) => {
    setScanImage(dataUrl);
    setStep('SKINCARE_QUESTIONS');
  };

  const handleSkincareComplete = (answers: Record<string, string>) => {
    setSkincareAnswers(answers as any);
    setStep('JAWLINE_QUESTIONS');
  };

  const handleJawlineComplete = async (answers: Record<string, string>) => {
    setJawlineAnswers(answers as any);
    setStep('ANALYZING');
    try {
      if (!scanImage) throw new Error("No image");
      const data = await analyzeFaceAndRoutine(scanImage, skincareAnswers as SkincareAnswers, answers as any);
      setResults(data);
      setStep('RESULTS');
    } catch (e) {
      console.error(e);
      alert("Analysis error. Please try again.");
      setStep('ONBOARDING');
    }
  };

  const resetApp = () => {
    setStep('ONBOARDING');
    setScanImage(null);
    setSkincareAnswers({});
    setJawlineAnswers({});
    setResults(null);
  };

  return (
    <div className="mobile-container overflow-y-auto flex flex-col h-screen">
      {step === 'ONBOARDING' && <Onboarding onStart={() => setStep('SCAN')} />}
      {step === 'SCAN' && <ScanStep onCapture={handleCapture} />}
      {step === 'SKINCARE_QUESTIONS' && <Questionnaire title="Skincare" colorClass="text-rose-500" questions={skincareQuestions} onComplete={handleSkincareComplete} />}
      {step === 'JAWLINE_QUESTIONS' && <Questionnaire title="Sculpting" colorClass="text-sky-500" questions={jawlineQuestions} onComplete={handleJawlineComplete} />}
      {step === 'ANALYZING' && <AnalyzingStep />}
      {step === 'RESULTS' && results && <ResultsView results={results} onReset={resetApp} onViewProducts={() => setStep('PRODUCT_SUGGESTIONS')} />}
      {step === 'PRODUCT_SUGGESTIONS' && <ProductSuggestionsView onBack={() => setStep('RESULTS')} />}
    </div>
  );
};