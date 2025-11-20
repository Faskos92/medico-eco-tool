import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, Calculator, FileText, Download, RotateCcw, AlertCircle, TrendingUp, DollarSign, Users, Target, Award } from 'lucide-react';

export default function MedicoEcoApp() {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const answered = Object.keys(answers).length;
    setProgress(Math.round((answered / 15) * 100));
  }, [answers]);

  const questions = [
    {
      section: "1. Questions sur l'intervention",
      icon: <DollarSign size={24} />,
      color: "text-blue-600",
      items: [
        { id: 'q1', text: "L'intervention modifie-t-elle les coûts de prise en charge ?", detail: "(hospitalisations, actes, médicaments coûteux)" },
        { id: 'q2', text: "L'intervention modifie-t-elle l'organisation des soins ?", detail: "(temps infirmier, consultations, nouvelles technologies)" },
        { id: 'q3', text: "L'intervention est-elle plus coûteuse que le standard actuel ?" },
        { id: 'q4', text: "L'intervention nécessite-t-elle une ressource rare ou limitée ?", detail: "(temps médical, IRM, biothérapies, équipes mobiles)" }
      ]
    },
    {
      section: "2. Questions sur la pathologie / population",
      icon: <Users size={24} />,
      color: "text-purple-600",
      items: [
        { id: 'q5', text: "La maladie représente-t-elle un poids économique important ?", detail: "(hospitalisations fréquentes, soins chroniques)" },
        { id: 'q6', text: "Le fardeau actuel est-il identifié comme problème hospitalier/national ?" },
        { id: 'q7', text: "La population génère-t-elle une forte variabilité de coûts ?" }
      ]
    },
    {
      section: "3. Questions sur le design de l'étude",
      icon: <Target size={24} />,
      color: "text-green-600",
      items: [
        { id: 'q8', text: "L'étude compare-t-elle deux stratégies de prise en charge ?" },
        { id: 'q9', text: "L'étude inclut-elle une intervention non médicamenteuse financée par un service ?", detail: "(télé-suivi, éducation thérapeutique, équipe mobile)" },
        { id: 'q10', text: "Un calcul de taille d'échantillon pour l'objectif économique est-il réaliste ?" }
      ]
    },
    {
      section: "4. Questions promoteur / financeur",
      icon: <Award size={24} />,
      color: "text-orange-600",
      items: [
        { id: 'q11', text: "Le financeur exige-t-il une analyse médico-économique ?", detail: "(PHRC, INCa, DGOS, appels innovation)" },
        { id: 'q12', text: "Le promoteur souhaite-t-il une estimation d'impact budgétaire local ?" },
        { id: 'q13', text: "Le projet vise-t-il un changement de pratiques à grande échelle ?" }
      ]
    },
    {
      section: "5. Questions sur l'impact décisionnel",
      icon: <TrendingUp size={24} />,
      color: "text-red-600",
      items: [
        { id: 'q14', text: "Les résultats économiques peuvent-ils influencer un changement de protocole, d'organisation, d'achat de matériel ou une diffusion nationale ?" },
        { id: 'q15', text: "Sans volet médico-éco, manque-t-il une dimension essentielle pour convaincre ?" }
      ]
    }
  ];

  const handleAnswer = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
    setShowResults(false);
  };

  const calculateScore = () => {
    return Object.values(answers).filter(v => v === true).length;
  };

  const getRecommendation = (score) => {
    if (score >= 6) {
      return {
        title: "Volet médico-économique fortement recommandé",
        color: "bg-red-50 border-red-300",
        bgGradient: "from-red-50 to-red-100",
        textColor: "text-red-800",
        badgeColor: "bg-red-600",
        icon: <AlertCircle size={28} />,
        action: "Inclure un volet médico-éco complet avec objectif principal ou co-principal. Prévoir méthodologiste et budget dédié.",
        steps: [
          "Contacter un méthodologiste médico-économique",
          "Définir la perspective d'analyse (hôpital, société, Assurance Maladie)",
          "Planifier la collecte des données de coûts",
          "Prévoir le budget nécessaire (temps méthodologiste, outils)",
          "Intégrer dans le protocole et la demande de financement"
        ]
      };
    } else if (score >= 3) {
      return {
        title: "Volet secondaire/exploratoire suffisant",
        color: "bg-orange-50 border-orange-300",
        bgGradient: "from-orange-50 to-orange-100",
        textColor: "text-orange-800",
        badgeColor: "bg-orange-600",
        icon: <AlertCircle size={28} />,
        action: "Inclure un volet médico-éco exploratoire (objectif secondaire). Collecter les données de coûts sans dimensionnement spécifique.",
        steps: [
          "Prévoir la collecte basique des données de coûts",
          "Mentionner dans le protocole comme objectif secondaire",
          "Envisager une analyse simple coût-conséquence",
          "Consulter un méthodologiste pour validation"
        ]
      };
    } else {
      return {
        title: "Volet médico-économique non nécessaire",
        color: "bg-green-50 border-green-300",
        bgGradient: "from-green-50 to-green-100",
        textColor: "text-green-800",
        badgeColor: "bg-green-600",
        icon: <CheckSquare size={28} />,
        action: "Ne pas inclure de volet médico-éco. Concentrer les ressources sur les objectifs cliniques. Ne pas surcharger le protocole.",
        steps: [
          "Se concentrer sur la qualité du protocole clinique",
          "Ne pas compliquer inutilement la méthodologie",
          "Garder les ressources pour le suivi clinique",
          "Documenter simplement les coûts standards si nécessaire"
        ]
      };
    }
  };

  const score = calculateScore();
  const recommendation = getRecommendation(score);
  const allAnswered = Object.keys(answers).length === 15;

  const generateReport = () => {
    const date = new Date().toLocaleDateString('fr-FR');
    let report = "═══════════════════════════════════════════════════════\n";
    report += "  ÉVALUATION VOLET MÉDICO-ÉCONOMIQUE\n";
    report += `  Date : ${date}\n`;
    report += "═══════════════════════════════════════════════════════\n\n";
    report += `SCORE OBTENU : ${score}/15 réponses OUI\n\n`;
    report += `┌─────────────────────────────────────────────────────┐\n`;
    report += `│ RECOMMANDATION                                      │\n`;
    report += `└─────────────────────────────────────────────────────┘\n`;
    report += `${recommendation.title.toUpperCase()}\n\n`;
    report += `${recommendation.action}\n\n`;
    report += `┌─────────────────────────────────────────────────────┐\n`;
    report += `│ PROCHAINES ÉTAPES                                   │\n`;
    report += `└─────────────────────────────────────────────────────┘\n`;
    recommendation.steps.forEach((step, i) => {
      report += `  ${i + 1}. ${step}\n`;
    });
    report += "\n";
    report += `┌─────────────────────────────────────────────────────┐\n`;
    report += `│ DÉTAIL DES RÉPONSES                                 │\n`;
    report += `└─────────────────────────────────────────────────────┘\n\n`;
    
    questions.forEach(section => {
      report += `${section.section}\n`;
      report += "─".repeat(55) + "\n";
      section.items.forEach(item => {
        const answer = answers[item.id] ? "✓ OUI" : answers[item.id] === false ? "✗ NON" : "? Non répondu";
        report += `  ${answer.padEnd(8)} │ ${item.text}\n`;
        if (item.detail) {
          report += `           │ ${item.detail}\n`;
        }
      });
      report += "\n";
    });
    
    report += "═══════════════════════════════════════════════════════\n";
    report += "Outil développé pour les investigateurs\n";
    report += "Référence : HAS, DRCI, PHRC, INCa\n";
    report += "═══════════════════════════════════════════════════════\n";
    
    return report;
  };

  const resetForm = () => {
    if (confirm("Êtes-vous sûr de vouloir réinitialiser toutes vos réponses ?")) {
      setAnswers({});
      setShowResults(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 mb-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-4">
              <Calculator className="text-white" size={32} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
              Faut-il un volet médico-économique ?
            </h1>
            <p className="text-gray-600 text-lg mb-4">
              Outil d'aide à la décision pour investigateurs
            </p>
            <div className="max-w-2xl mx-auto bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <p className="text-sm text-indigo-900">
                <strong>⏱️ 5 minutes</strong> · Répondez à 15 questions pour obtenir une recommandation claire
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progression</span>
              <span className="text-sm font-bold text-indigo-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center">
              {Object.keys(answers).length} / 15 questions répondues
            </p>
          </div>
        </div>

        {/* Questions */}
        {questions.map((section, sectionIndex) => (
          <div key={sectionIndex} className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className={`${section.color}`}>
                {section.icon}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                {section.section}
              </h2>
            </div>
            <div className="space-y-5">
              {section.items.map(item => (
                <div key={item.id} className="bg-gradient-to-r from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200 hover:shadow-md transition-all">
                  <p className="font-semibold text-gray-800 mb-1 text-base sm:text-lg">
                    {item.text}
                  </p>
                  {item.detail && (
                    <p className="text-sm text-gray-600 mb-4 italic">
                      {item.detail}
                    </p>
                  )}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAnswer(item.id, true)}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                        answers[item.id] === true
                          ? 'bg-green-600 text-white shadow-lg scale-105'
                          : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-green-500 hover:bg-green-50'
                      }`}
                    >
                      {answers[item.id] === true ? <CheckSquare size={20} /> : <Square size={20} />}
                      OUI
                    </button>
                    <button
                      onClick={() => handleAnswer(item.id, false)}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                        answers[item.id] === false
                          ? 'bg-red-600 text-white shadow-lg scale-105'
                          : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-red-500 hover:bg-red-50'
                      }`}
                    >
                      {answers[item.id] === false ? <CheckSquare size={20} /> : <Square size={20} />}
                      NON
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Action Buttons */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setShowResults(true)}
              disabled={!allAnswered}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-lg font-bold text-lg transition-all ${
                allAnswered
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Calculator size={24} />
              Voir les résultats
            </button>
            <button
              onClick={resetForm}
              className="sm:w-auto px-8 py-4 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw size={20} />
              Réinitialiser
            </button>
          </div>
          {!allAnswered && (
            <p className="text-center text-sm text-orange-600 mt-3 font-medium">
              ⚠️ Veuillez répondre à toutes les questions pour voir les résultats
            </p>
          )}
        </div>

        {/* Results */}
        {showResults && allAnswered && (
          <div className={`bg-gradient-to-br ${recommendation.bgGradient} border-3 rounded-xl shadow-2xl p-6 sm:p-8 mb-6 animate-in`}>
            <div className="flex items-center gap-4 mb-6">
              <div className={`${recommendation.badgeColor} text-white rounded-full p-4 shadow-lg`}>
                {recommendation.icon}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className={`${recommendation.badgeColor} text-white px-4 py-1 rounded-full text-sm font-bold`}>
                    Score : {score}/15
                  </span>
                </div>
                <h3 className={`text-2xl sm:text-3xl font-bold ${recommendation.textColor}`}>
                  {recommendation.title}
                </h3>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md mb-6">
              <h4 className="font-bold text-gray-800 text-lg mb-3 flex items-center gap-2">
                <Target size={20} className="text-indigo-600" />
                Recommandation
              </h4>
              <p className="text-gray-800 font-medium mb-6 text-base leading-relaxed">
                {recommendation.action}
              </p>
              
              <h4 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-indigo-600" />
                Prochaines étapes
              </h4>
              <ul className="space-y-3">
                {recommendation.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                    <span className="flex-shrink-0 w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </span>
                    <span className="text-gray-800 pt-1">{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-indigo-900 text-white rounded-xl p-5 mb-6 shadow-lg">
              <p className="text-sm leading-relaxed">
                <strong className="text-indigo-200">💡 Principe clé :</strong> Inclure un volet médico-économique uniquement si l'intervention modifie les coûts ou l'organisation, si le financeur l'exige, ou si cela apporte un argument décisif pour un changement de pratique. Sinon, garder le protocole simple et centré sur les objectifs cliniques.
              </p>
            </div>

            <button
              onClick={() => {
                const report = generateReport();
                const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `evaluation_medico_eco_${new Date().toISOString().split('T')[0]}.txt`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="w-full flex items-center justify-center gap-3 py-4 bg-white border-3 border-indigo-600 text-indigo-600 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-all shadow-md hover:shadow-lg"
            >
              <Download size={24} />
              Télécharger le rapport complet
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 dark:text-gray-400 text-sm">
          <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Kiyali COULIBALY</p>
          <p className="text-gray-600 dark:text-gray-400">Économiste de la santé</p>
          <p className="text-gray-600 dark:text-gray-400 mb-4">CHU Poitiers | Limoges</p>
          <p>Références : HAS, DRCI, PHRC, INCa, DGOS</p>
          <p className="mt-2">Outil open-source • Version 2.0 • 2025</p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
