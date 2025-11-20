import React, { useState, useEffect } from 'react';
import { Calculator, Download, Copy, Moon, Sun, RotateCcw, AlertCircle, CheckCircle, XCircle, DollarSign, Users, Target, Award, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';

function Circle({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

const QUESTIONS = [
  {
    section: "1. Questions sur l'intervention",
    icon: DollarSign,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    items: [
      { id: 'q1', text: "L'intervention modifie-t-elle les coûts de prise en charge ?", detail: "(hospitalisations, actes, médicaments coûteux)" },
      { id: 'q2', text: "L'intervention modifie-t-elle l'organisation des soins ?", detail: "(temps infirmier, consultations, nouvelles technologies)" },
      { id: 'q3', text: "L'intervention est-elle plus coûteuse que le standard actuel ?" },
      { id: 'q4', text: "L'intervention nécessite-t-elle une ressource rare ou limitée ?", detail: "(temps médical, IRM, biothérapies, équipes mobiles)" }
    ]
  },
  {
    section: "2. Questions sur la pathologie / population",
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-200 dark:border-purple-800",
    items: [
      { id: 'q5', text: "La maladie représente-t-elle un poids économique important ?", detail: "(hospitalisations fréquentes, soins chroniques)" },
      { id: 'q6', text: "Le fardeau actuel est-il identifié comme problème hospitalier/national ?" },
      { id: 'q7', text: "La population génère-t-elle une forte variabilité de coûts ?" }
    ]
  },
  {
    section: "3. Questions sur le design de l'étude",
    icon: Target,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-800",
    items: [
      { id: 'q8', text: "L'étude compare-t-elle deux stratégies de prise en charge ?" },
      { id: 'q9', text: "L'étude inclut-elle une intervention non médicamenteuse financée par un service ?", detail: "(télé-suivi, éducation thérapeutique, équipe mobile)" },
      { id: 'q10', text: "Un calcul de taille d'échantillon pour l'objectif économique est-il réaliste ?" }
    ]
  },
  {
    section: "4. Questions promoteur / financeur",
    icon: Award,
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    borderColor: "border-orange-200 dark:border-orange-800",
    items: [
      { id: 'q11', text: "Le financeur exige-t-il une analyse médico-économique ?", detail: "(PHRC, INCa, DGOS, appels innovation)" },
      { id: 'q12', text: "Le promoteur souhaite-t-il une estimation d'impact budgétaire local ?" },
      { id: 'q13', text: "Le projet vise-t-il un changement de pratiques à grande échelle ?" }
    ]
  },
  {
    section: "5. Questions sur l'impact décisionnel",
    icon: TrendingUp,
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-800",
    items: [
      { id: 'q14', text: "Les résultats économiques peuvent-ils influencer un changement de protocole, d'organisation, d'achat de matériel ou une diffusion nationale ?" },
      { id: 'q15', text: "Sans volet médico-éco, manque-t-il une dimension essentielle pour convaincre ?" }
    ]
  }
];

const TOTAL_QUESTIONS = 15;

export default function MedicoEcoApp() {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [progressAnimation, setProgressAnimation] = useState(0);

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
    
    // Initialiser toutes les sections comme dépliées
    const initialExpanded = {};
    QUESTIONS.forEach((_, index) => {
      initialExpanded[index] = true;
    });
    setExpandedSections(initialExpanded);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const answeredCount = Object.values(answers).filter(a => a !== null).length;
  const progress = Math.round((answeredCount / TOTAL_QUESTIONS) * 100);
  
  // Animation de progression
  useEffect(() => {
    if (progressAnimation < progress) {
      const timer = setTimeout(() => {
        setProgressAnimation(progressAnimation + 1);
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [progressAnimation, progress]);

  const score = Object.values(answers).filter(v => v === true).length;
  const allAnswered = answeredCount === TOTAL_QUESTIONS;

  const handleAnswer = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
    setShowResults(false);
  };

  const toggleSection = (index) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const getRecommendation = (score) => {
    if (score >= 6) {
      return {
        title: "Volet médico-économique fortement recommandé",
        color: "bg-red-100 dark:bg-red-900/30 border-red-400 dark:border-red-700",
        textColor: "text-red-800 dark:text-red-200",
        badge: "bg-red-600",
        icon: <AlertCircle className="w-8 h-8" />,
        action: "Inclure un volet médico-éco complet avec objectif principal ou co-principal. Prévoir méthodologiste et budget dédié.",
        steps: [
          "Contacter un méthodologiste médico-économique",
          "Définir la perspective d'analyse (hôpital, société, Assurance Maladie)",
          "Planifier la collecte des données de coûts",
          "Prévoir le budget nécessaire",
          "Intégrer dans le protocole et la demande de financement"
        ]
      };
    } else if (score >= 3) {
      return {
        title: "Volet secondaire/exploratoire suffisant",
        color: "bg-orange-100 dark:bg-orange-900/30 border-orange-400 dark:border-orange-700",
        textColor: "text-orange-800 dark:text-orange-200",
        badge: "bg-orange-600",
        icon: <AlertCircle className="w-8 h-8" />,
        action: "Inclure un objectif médico-éco exploratoire (secondaire). Collecter les coûts sans dimensionnement.",
        steps: [
          "Prévoir la collecte basique des données de coûts",
          "Mentionner comme objectif secondaire",
          "Envisager une analyse coût-conséquence",
          "Consulter un méthodologiste pour validation"
        ]
      };
    } else {
      return {
        title: "Volet médico-économique non nécessaire",
        color: "bg-green-100 dark:bg-green-900/30 border-green-400 dark:border-green-700",
        textColor: "text-green-800 dark:text-green-200",
        badge: "bg-green-600",
        icon: <CheckCircle className="w-8 h-8" />,
        action: "Concentrer les ressources sur les objectifs cliniques. Ne pas surcharger le protocole.",
        steps: [
          "Prioriser la qualité du protocole clinique",
          "Éviter toute complexité méthodologique inutile",
          "Garder les ressources pour le suivi clinique",
          "Documenter simplement les coûts standards si besoin"
        ]
      };
    }
  };

  const recommendation = getRecommendation(score);

  const generateReportText = () => {
    const date = new Date().toLocaleDateString('fr-FR');
    let report = `ÉVALUATION VOLET MÉDICO-ÉCONOMIQUE\n`;
    report += `Date : ${date}\n`;
    report += `${'='.repeat(50)}\n\n`;
    report += `Score : ${score}/15 réponses OUI\n\n`;
    report += `${recommendation.title.toUpperCase()}\n\n`;
    report += `${recommendation.action}\n\n`;
    report += `Prochaines étapes :\n`;
    recommendation.steps.forEach((s, i) => report += `${i + 1}. ${s}\n`);
    report += `\nDétail des réponses :\n\n`;

    QUESTIONS.forEach(sec => {
      report += `${sec.section}\n${'-'.repeat(40)}\n`;
      sec.items.forEach(item => {
        const ans = answers[item.id];
        const mark = ans === true ? "✓ OUI" : ans === false ? "✗ NON" : "? Non répondu";
        report += `${mark} ${item.text}\n`;
        if (item.detail) report += `    ${item.detail}\n`;
      });
      report += `\n`;
    });

    return report;
  };

  const copyReport = () => {
    navigator.clipboard.writeText(generateReportText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    if (confirm("Voulez-vous vraiment tout réinitialiser ?")) {
      setAnswers({});
      setShowResults(false);
      setProgressAnimation(0);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
      <div className="max-w-5xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8 transition-all duration-500 hover:shadow-2xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-lg">
                <Calculator className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
                  Faut-il un volet médico-économique ?
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg mt-2">
                  Outil d'aide à la décision pour investigateurs et promoteurs
                </p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition transform hover:scale-105"
              aria-label="Changer de thème"
            >
              {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
          </div>

          <div className="mt-8">
            <div className="flex justify-between mb-3">
              <span className="font-semibold text-gray-700 dark:text-gray-300">Progression</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{progressAnimation}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-1000 ease-out shadow-lg"
                style={{ width: `${progressAnimation}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
              {answeredCount} / {TOTAL_QUESTIONS} questions répondues
            </p>
          </div>
        </div>

        {/* Questions avec sections pliables */}
        {QUESTIONS.map((section, sectionIndex) => (
          <div
            key={section.section}
            className={`${section.bgColor} ${section.borderColor} border rounded-2xl shadow-lg mb-6 overflow-hidden transition-all duration-300`}
          >
            <button
              onClick={() => toggleSection(sectionIndex)}
              className="w-full p-6 text-left flex justify-between items-center hover:bg-opacity-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`${section.color}`}>
                  <section.icon size={28} />
                </div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  {section.section}
                </h2>
              </div>
              <div className={`transform transition-transform ${expandedSections[sectionIndex] ? 'rotate-180' : ''}`}>
                <ChevronDown size={24} />
              </div>
            </button>

            {expandedSections[sectionIndex] && (
              <div className="px-6 pb-6 space-y-4 animate-fadeIn">
                {section.items.map(({ id, text, detail }) => {
                  const answered = answers[id];
                  return (
                    <div
                      key={id}
                      className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <p className="font-semibold text-gray-800 dark:text-gray-100 text-lg mb-2">
                        {text}
                      </p>
                      {detail && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-4">
                          {detail}
                        </p>
                      )}

                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => handleAnswer(id, true)}
                          className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                            answered === true
                              ? 'bg-green-600 text-white shadow-lg scale-[1.02]'
                              : 'bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-200 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'
                          }`}
                          aria-pressed={answered === true}
                        >
                          {answered === true ? <CheckCircle size={20} /> : <Circle size={20} />}
                          OUI
                        </button>
                        <button
                          onClick={() => handleAnswer(id, false)}
                          className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                            answered === false
                              ? 'bg-red-600 text-white shadow-lg scale-[1.02]'
                              : 'bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-200 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                          }`}
                          aria-pressed={answered === false}
                        >
                          {answered === false ? <XCircle size={20} /> : <Circle size={20} />}
                          NON
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 sticky bottom-4 z-10">
          <button
            onClick={() => setShowResults(true)}
            disabled={!allAnswered}
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
              allAnswered
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-105'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Calculator size={24} />
            Voir les résultats
          </button>
          <button
            onClick={reset}
            className="px-8 py-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center justify-center gap-3"
          >
            <RotateCcw size={20} />
            Réinitialiser
          </button>
        </div>

        {/* Résultats */}
        {showResults && allAnswered && (
          <div
            className={`${recommendation.color} border-2 rounded-2xl shadow-2xl p-8 animate-fadeIn mb-8`}
            id="report-content"
          >
            <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
              <div className={`${recommendation.badge} text-white p-5 rounded-full shadow-lg flex-shrink-0`}>
                {recommendation.icon}
              </div>
              <div className="flex-1">
                <span className={`${recommendation.badge} text-white px-5 py-2 rounded-full font-bold inline-block mb-3`}>
                  Score : {score}/15
                </span>
                <h3 className={`text-2xl md:text-3xl font-bold ${recommendation.textColor}`}>
                  {recommendation.title}
                </h3>
                <p className="mt-4 text-lg font-medium">
                  {recommendation.action}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-inner">
              <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
                Prochaines étapes recommandées
              </h4>
              <ol className="space-y-3">
                {recommendation.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300 pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={copyReport}
                className="flex-1 flex items-center justify-center gap-3 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg"
              >
                <Copy size={20} />
                {copied ? 'Copié !' : 'Copier le rapport'}
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 dark:text-gray-400 text-sm pb-8">
          <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Kiyali COULIBALY</p>
          <p className="text-gray-600 dark:text-gray-400">Économiste de la santé</p>
          <p className="text-gray-600 dark:text-gray-400 mb-4">CHU Poitiers | Limoges</p>
          <p>Références : HAS, DRCI, PHRC, INCa, DGOS</p>
          <p className="mt-2">Outil open-source • Version 2.0 • 2025</p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}