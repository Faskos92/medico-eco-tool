import React, { useState, useEffect } from 'react';
import { Calculator, Copy, Moon, Sun, RotateCcw, AlertCircle, CheckCircle, XCircle, DollarSign, Users, Target, Award, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';

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
    items: [
      { id: 'q5', text: "La maladie représente-t-elle un poids économique important ?", detail: "(hospitalisations fréquentes, soins chroniques)" },
      { id: 'q6', text: "Le fardeau actuel est-il identifié comme problème hospitalier/national ?" },
      { id: 'q7', text: "La population génère-t-elle une forte variabilité de coûts ?" }
    ]
  },
  {
    section: "3. Questions sur le design de l'étude",
    icon: Target,
    items: [
      { id: 'q8', text: "L'étude compare-t-elle deux stratégies de prise en charge ?" },
      { id: 'q9', text: "L'étude inclut-elle une intervention non médicamenteuse financée par un service ?", detail: "(télé-suivi, éducation thérapeutique, équipe mobile)" },
      { id: 'q10', text: "Un calcul de taille d'échantillon pour l'objectif économique est-il réaliste ?" }
    ]
  },
  {
    section: "4. Questions promoteur / financeur",
    icon: Award,
    items: [
      { id: 'q11', text: "Le financeur exige-t-il une analyse médico-économique ?", detail: "(PHRC, INCa, DGOS, appels innovation)" },
      { id: 'q12', text: "Le promoteur souhaite-t-il une estimation d'impact budgétaire local ?" },
      { id: 'q13', text: "Le projet vise-t-il un changement de pratiques à grande échelle ?" }
    ]
  },
  {
    section: "5. Questions sur l'impact décisionnel",
    icon: TrendingUp,
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

  const answeredCount = Object.values(answers).filter(a => a !== null).length;
  const progress = Math.round((answeredCount / TOTAL_QUESTIONS) * 100);
  const score = Object.values(answers).filter(v => v === true).length;
  const allAnswered = answeredCount === TOTAL_QUESTIONS;

  const handleAnswer = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
    setShowResults(false);
  };

  const getRecommendation = (score) => {
    if (score >= 6) {
      return {
        title: "Volet médico-économique fortement recommandé",
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

  const reset = () => {
    if (confirm("Voulez-vous vraiment tout réinitialiser ?")) {
      setAnswers({});
      setShowResults(false);
    }
  };

  // Styles CSS en objet JavaScript
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: darkMode ? '#1f2937' : '#f8fafc',
      transition: 'background-color 0.5s'
    },
    header: {
      backgroundColor: darkMode ? '#374151' : 'white',
      borderRadius: '16px',
      padding: '32px',
      marginBottom: '32px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
    },
    section: {
      backgroundColor: darkMode ? '#374151' : 'white',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
    },
    questionCard: {
      backgroundColor: darkMode ? '#4b5563' : '#f9fafb',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '16px',
      border: `1px solid ${darkMode ? '#6b7280' : '#e5e7eb'}`,
      transition: 'all 0.3s'
    },
    button: {
      flex: 1,
      padding: '16px',
      borderRadius: '8px',
      fontWeight: 'bold',
      fontSize: '16px',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    buttonYes: {
      backgroundColor: '#16a34a',
      color: 'white',
      transform: 'scale(1.02)'
    },
    buttonNo: {
      backgroundColor: '#dc2626',
      color: 'white',
      transform: 'scale(1.02)'
    },
    buttonInactive: {
      backgroundColor: darkMode ? '#4b5563' : 'white',
      color: darkMode ? '#d1d5db' : '#374151',
      border: `2px solid ${darkMode ? '#6b7280' : '#d1d5db'}`
    },
    progressBar: {
      width: '100%',
      backgroundColor: darkMode ? '#4b5563' : '#e5e7eb',
      borderRadius: '8px',
      height: '12px',
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      background: 'linear-gradient(to right, #4f46e5, #7c3aed)',
      transition: 'width 0.6s ease',
      width: `${progress}%`
    },
    resultCard: {
      backgroundColor: score >= 6 ? '#fef2f2' : score >= 3 ? '#fffbeb' : '#f0fdf4',
      border: `2px solid ${score >= 6 ? '#f87171' : score >= 3 ? '#f59e0b' : '#4ade80'}`,
      borderRadius: '16px',
      padding: '32px',
      marginBottom: '32px',
      boxShadow: '0 20px 25px rgba(0,0,0,0.1)'
    }
  };

  return (
    <div style={styles.container}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '16px' }}>
        
        {/* Header */}
        <div style={styles.header}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div>
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                width: '64px', 
                height: '64px', 
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                borderRadius: '50%',
                marginBottom: '16px'
              }}>
                <Calculator size={32} color="white" />
              </div>
              <h1 style={{ 
                fontSize: '32px', 
                fontWeight: 'bold', 
                color: darkMode ? 'white' : '#1f2937',
                margin: 0
              }}>
                Faut-il un volet médico-économique ?
              </h1>
              <p style={{ 
                color: darkMode ? '#d1d5db' : '#6b7280',
                fontSize: '18px',
                margin: '8px 0 0 0'
              }}>
                Outil d'aide à la décision pour les enquêteurs
              </p>
              <p style={{ 
                color: darkMode ? '#9ca3af' : '#9ca3af',
                fontSize: '14px',
                margin: '8px 0 0 0'
              }}>
                <strong>5 minutes</strong> : Répondez à 15 questions pour obtenir une recommandation claire
              </p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{
                padding: '12px',
                borderRadius: '12px',
                backgroundColor: darkMode ? '#4b5563' : '#f3f4f6',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {darkMode ? <Sun size={24} color="#fbbf24" /> : <Moon size={24} color="#4b5563" />}
            </button>
          </div>

          <div style={{ marginTop: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ 
                fontWeight: '600', 
                color: darkMode ? '#d1d5db' : '#374151' 
              }}>
                Progression {progress}%
              </span>
              <span style={{ 
                fontWeight: 'bold', 
                color: '#4f46e5' 
              }}>
                {answeredCount}/{TOTAL_QUESTIONS} questions répondues
              </span>
            </div>
            <div style={styles.progressBar}>
              <div style={styles.progressFill} />
            </div>
          </div>
        </div>

        {/* Questions */}
        {QUESTIONS.map((section) => (
          <div key={section.section} style={styles.section}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{ color: '#4f46e5' }}>
                <section.icon size={28} />
              </div>
              <h2 style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                color: darkMode ? 'white' : '#1f2937',
                margin: 0
              }}>
                {section.section}
              </h2>
            </div>

            <div>
              {section.items.map(({ id, text, detail }) => {
                const answered = answers[id];
                return (
                  <div key={id} style={styles.questionCard}>
                    <p style={{ 
                      fontWeight: '600', 
                      color: darkMode ? 'white' : '#1f2937',
                      fontSize: '16px',
                      margin: '0 0 8px 0'
                    }}>
                      {text}
                    </p>
                    {detail && (
                      <p style={{ 
                        fontSize: '14px', 
                        color: darkMode ? '#9ca3af' : '#6b7280',
                        fontStyle: 'italic',
                        margin: '0 0 16px 0'
                      }}>
                        {detail}
                      </p>
                    )}

                    <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                      <button
                        onClick={() => handleAnswer(id, true)}
                        style={{
                          ...styles.button,
                          ...(answered === true ? styles.buttonYes : styles.buttonInactive)
                        }}
                      >
                        {answered === true ? <CheckCircle size={20} /> : <Circle size={20} />}
                        OUI
                      </button>
                      <button
                        onClick={() => handleAnswer(id, false)}
                        style={{
                          ...styles.button,
                          ...(answered === false ? styles.buttonNo : styles.buttonInactive)
                        }}
                      >
                        {answered === false ? <XCircle size={20} /> : <Circle size={20} />}
                        NON
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
          <button
            onClick={() => setShowResults(true)}
            disabled={!allAnswered}
            style={{
              flex: 1,
              padding: '20px',
              background: allAnswered ? 'linear-gradient(to right, #4f46e5, #7c3aed)' : (darkMode ? '#4b5563' : '#d1d5db'),
              color: 'white',
              borderRadius: '12px',
              fontWeight: 'bold',
              fontSize: '18px',
              border: 'none',
              cursor: allAnswered ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}
          >
            <Calculator size={24} />
            Voir les résultats
          </button>
          <button
            onClick={reset}
            style={{
              padding: '20px 24px',
              backgroundColor: darkMode ? '#4b5563' : '#e5e7eb',
              color: darkMode ? '#d1d5db' : '#374151',
              borderRadius: '12px',
              fontWeight: 'bold',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <RotateCcw size={20} />
            Réinitialiser
          </button>
        </div>

        {/* Résultats */}
        {showResults && allAnswered && (
          <div style={styles.resultCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{ 
                backgroundColor: score >= 6 ? '#dc2626' : score >= 3 ? '#d97706' : '#16a34a',
                color: 'white',
                padding: '16px',
                borderRadius: '50%'
              }}>
                {score >= 6 ? <AlertCircle size={32} /> : score >= 3 ? <AlertCircle size={32} /> : <CheckCircle size={32} />}
              </div>
              <div>
                <span style={{
                  backgroundColor: score >= 6 ? '#dc2626' : score >= 3 ? '#d97706' : '#16a34a',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}>
                  Score : {score}/15
                </span>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: score >= 6 ? '#dc2626' : score >= 3 ? '#d97706' : '#16a34a',
                  margin: '12px 0 0 0'
                }}>
                  {recommendation.title}
                </h3>
              </div>
            </div>

            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <p style={{
                fontSize: '16px',
                fontWeight: '500',
                color: '#374151',
                lineHeight: '1.6',
                margin: '0 0 24px 0'
              }}>
                {recommendation.action}
              </p>

              <h4 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: '0 0 16px 0'
              }}>
                Prochaines étapes recommandées
              </h4>
              <ol style={{ paddingLeft: '20px', margin: 0 }}>
                {recommendation.steps.map((step, i) => (
                  <li key={i} style={{ 
                    color: '#374151',
                    fontSize: '16px',
                    lineHeight: '1.6',
                    marginBottom: '12px',
                    paddingLeft: '8px'
                  }}>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <div style={{ marginTop: '24px' }}>
              <button
                onClick={() => {
                  const reportText = `
ÉVALUATION VOLET MÉDICO-ÉCONOMIQUE
Date : ${new Date().toLocaleDateString('fr-FR')}
${'='.repeat(50)}

Score : ${score}/15 réponses OUI

${recommendation.title.toUpperCase()}

${recommendation.action}

Prochaines étapes :
${recommendation.steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}
                  `.trim();
                  
                  navigator.clipboard.writeText(reportText);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: '#4f46e5',
                  color: 'white',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Copy size={20} />
                {copied ? 'Copié !' : 'Copier le rapport'}
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ 
          textAlign: 'center', 
          color: darkMode ? '#9ca3af' : '#6b7280',
          fontSize: '14px',
          padding: '32px 0'
        }}>
          <p style={{ fontWeight: '600', color: darkMode ? '#d1d5db' : '#374151', margin: '0 0 4px 0' }}>
            Kiyali COULIBALY
          </p>
          <p style={{ margin: '0 0 4px 0' }}>Économiste de la santé</p>
          <p style={{ margin: '0 0 16px 0' }}>CHU Poitiers & Limoges</p>
          <p style={{ margin: '0 0 4px 0' }}>Références : HAS, DRCI, PHRC, INCa, DGOS</p>
          <p style={{ margin: '4px 0 0 0' }}>Outil open-source • Version 2.0 • 2025</p>
        </div>
      </div>
    </div>
  );
}