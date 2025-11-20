import React, { useState, useEffect } from 'react';
import { Calculator, Copy, Moon, Sun, RotateCcw, AlertCircle, CheckCircle, XCircle, DollarSign, Users, Target, Award, TrendingUp } from 'lucide-react';

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
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

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
        ],
        color: "#dc2626"
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
        ],
        color: "#d97706"
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
        ],
        color: "#16a34a"
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

  const copyReport = () => {
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
  };

  // Styles responsive
  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: darkMode ? '#111827' : '#f3f4f6',
    transition: 'background-color 0.3s',
    padding: isMobile ? '12px' : '20px'
  };

  const cardStyle = {
    backgroundColor: darkMode ? '#1f2937' : 'white',
    borderRadius: isMobile ? '8px' : '12px',
    padding: isMobile ? '16px' : '24px',
    marginBottom: isMobile ? '16px' : '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  };

  const headerTitleStyle = {
    fontSize: isMobile ? '20px' : isTablet ? '24px' : '28px',
    fontWeight: 'bold', 
    color: darkMode ? 'white' : '#1f2937',
    margin: 0,
    lineHeight: 1.2
  };

  const sectionTitleStyle = {
    fontSize: isMobile ? '16px' : '18px', 
    fontWeight: 'bold', 
    color: darkMode ? 'white' : '#1f2937',
    margin: 0
  };

  const questionTextStyle = {
    fontWeight: '600', 
    color: darkMode ? 'white' : '#1f2937',
    margin: '0 0 8px 0',
    fontSize: isMobile ? '14px' : '16px',
    lineHeight: 1.4
  };

  const buttonStyle = {
    padding: isMobile ? '10px 12px' : '12px 16px',
    borderRadius: '6px',
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    fontSize: isMobile ? '14px' : '16px'
  };

  return (
    <div style={containerStyle}>
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        width: '100%'
      }}>
        
        {/* Header */}
        <div style={cardStyle}>
          <div style={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between', 
            alignItems: isMobile ? 'flex-start' : 'flex-start',
            gap: isMobile ? '16px' : '0',
            marginBottom: '20px' 
          }}>
            <div style={{ 
              flex: 1,
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'flex-start' : 'center',
              gap: isMobile ? '12px' : '16px'
            }}>
              <div style={{ 
                width: isMobile ? '50px' : '60px', 
                height: isMobile ? '50px' : '60px', 
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Calculator size={isMobile ? 24 : 32} color="white" />
              </div>
              <div style={{ flex: 1 }}>
                <h1 style={headerTitleStyle}>
                  Faut-il un volet médico-économique ?
                </h1>
                <p style={{ 
                  color: darkMode ? '#d1d5db' : '#6b7280',
                  margin: '4px 0 0 0',
                  fontSize: isMobile ? '14px' : '16px'
                }}>
                  Outil d'aide à la décision pour les enquêteurs
                </p>
                
                <div style={{ 
                  backgroundColor: darkMode ? '#374151' : '#f3f4f6',
                  padding: isMobile ? '8px 12px' : '12px 16px',
                  borderRadius: '6px',
                  marginTop: '12px'
                }}>
                  <p style={{ 
                    color: darkMode ? '#e5e7eb' : '#4b5563',
                    fontSize: isMobile ? '12px' : '14px',
                    margin: 0,
                    lineHeight: 1.4
                  }}>
                    <strong>{isMobile ? '5 min' : '5 minutes'}</strong> : {isMobile ? '15 questions pour une recommandation' : 'Répondez à 15 questions pour obtenir une recommandation claire'}
                  </p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{
                padding: isMobile ? '8px' : '12px',
                borderRadius: '6px',
                backgroundColor: darkMode ? '#374151' : '#f3f4f6',
                border: 'none',
                cursor: 'pointer',
                alignSelf: isMobile ? 'flex-end' : 'flex-start',
                marginTop: isMobile ? '-50px' : '0'
              }}
            >
              {darkMode ? <Sun size={isMobile ? 18 : 20} color="#fbbf24" /> : <Moon size={isMobile ? 18 : 20} color="#4b5563" />}
            </button>
          </div>

          <div style={{ marginTop: '20px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '8px',
              flexWrap: 'wrap',
              gap: '4px'
            }}>
              <span style={{ 
                fontWeight: '600', 
                color: darkMode ? '#d1d5db' : '#374151',
                fontSize: isMobile ? '12px' : '14px'
              }}>
                Progression {progress}%
              </span>
              <span style={{ 
                fontWeight: 'bold', 
                color: '#4f46e5',
                fontSize: isMobile ? '12px' : '14px'
              }}>
                {answeredCount}/{TOTAL_QUESTIONS} questions
              </span>
            </div>
            <div style={{
              width: '100%',
              backgroundColor: darkMode ? '#374151' : '#e5e7eb',
              borderRadius: '6px',
              height: isMobile ? '6px' : '8px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                background: 'linear-gradient(to right, #4f46e5, #7c3aed)',
                width: `${progress}%`,
                transition: 'width 0.3s ease-in-out',
                borderRadius: '6px'
              }} />
            </div>
          </div>
        </div>

        {/* Questions */}
        {QUESTIONS.map((section) => (
          <div key={section.section} style={cardStyle}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: isMobile ? '8px' : '12px', 
              marginBottom: '16px' 
            }}>
              <section.icon size={isMobile ? 20 : 24} color={darkMode ? '#9ca3af' : '#6b7280'} />
              <h2 style={sectionTitleStyle}>
                {section.section}
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {section.items.map(({ id, text, detail }) => {
                const answered = answers[id];
                return (
                  <div key={id} style={{
                    backgroundColor: darkMode ? '#374151' : '#f9fafb',
                    borderRadius: '6px',
                    padding: isMobile ? '12px' : '16px',
                    border: `1px solid ${darkMode ? '#4b5563' : '#e5e7eb'}`
                  }}>
                    <p style={questionTextStyle}>
                      {text}
                    </p>
                    {detail && (
                      <p style={{ 
                        fontSize: isMobile ? '12px' : '14px', 
                        color: darkMode ? '#9ca3af' : '#6b7280',
                        fontStyle: 'italic',
                        margin: '0 0 8px 0',
                        lineHeight: 1.4
                      }}>
                        {detail}
                      </p>
                    )}

                    <div style={{ 
                      display: 'flex', 
                      gap: '8px',
                      flexDirection: isMobile ? 'column' : 'row'
                    }}>
                      <button
                        onClick={() => handleAnswer(id, true)}
                        style={{
                          ...buttonStyle,
                          flex: isMobile ? 1 : 1,
                          backgroundColor: answered === true ? '#16a34a' : (darkMode ? '#4b5563' : 'white'),
                          color: answered === true ? 'white' : (darkMode ? '#d1d5db' : '#374151'),
                          border: answered === true ? 'none' : `1px solid ${darkMode ? '#6b7280' : '#d1d5db'}`,
                        }}
                      >
                        {answered === true ? <CheckCircle size={isMobile ? 16 : 18} /> : 'O'}
                        OUI
                      </button>
                      <button
                        onClick={() => handleAnswer(id, false)}
                        style={{
                          ...buttonStyle,
                          flex: isMobile ? 1 : 1,
                          backgroundColor: answered === false ? '#dc2626' : (darkMode ? '#4b5563' : 'white'),
                          color: answered === false ? 'white' : (darkMode ? '#d1d5db' : '#374151'),
                          border: answered === false ? 'none' : `1px solid ${darkMode ? '#6b7280' : '#d1d5db'}`,
                        }}
                      >
                        {answered === false ? <XCircle size={isMobile ? 16 : 18} /> : 'O'}
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
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          marginBottom: '20px',
          flexDirection: isMobile ? 'column' : 'row'
        }}>
          <button
            onClick={() => setShowResults(true)}
            disabled={!allAnswered}
            style={{
              flex: 1,
              padding: isMobile ? '14px 16px' : '16px 20px',
              background: allAnswered ? 'linear-gradient(to right, #4f46e5, #7c3aed)' : (darkMode ? '#374151' : '#d1d5db'),
              color: 'white',
              borderRadius: '8px',
              fontWeight: 'bold',
              border: 'none',
              cursor: allAnswered ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: isMobile ? '14px' : '16px'
            }}
          >
            <Calculator size={isMobile ? 18 : 20} />
            {isMobile ? 'Résultats' : 'Voir les résultats'}
          </button>
          <button
            onClick={reset}
            style={{
              padding: isMobile ? '14px 16px' : '16px 20px',
              backgroundColor: darkMode ? '#374151' : '#e5e7eb',
              color: darkMode ? '#d1d5db' : '#374151',
              borderRadius: '8px',
              fontWeight: 'bold',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: isMobile ? '14px' : '16px',
              minWidth: isMobile ? 'auto' : '140px'
            }}
          >
            <RotateCcw size={isMobile ? 16 : 18} />
            {isMobile ? 'Reset' : 'Réinitialiser'}
          </button>
        </div>

        {/* Résultats */}
        {showResults && allAnswered && (
          <div style={{
            backgroundColor: `${recommendation.color}15`,
            border: `2px solid ${recommendation.color}`,
            borderRadius: isMobile ? '8px' : '12px',
            padding: isMobile ? '16px' : '24px',
            marginBottom: '20px'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: isMobile ? 'flex-start' : 'center', 
              gap: '12px', 
              marginBottom: '16px',
              flexDirection: isMobile ? 'column' : 'row'
            }}>
              <div style={{ 
                backgroundColor: recommendation.color,
                color: 'white',
                padding: isMobile ? '10px' : '12px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {score >= 6 ? <AlertCircle size={isMobile ? 20 : 24} /> : score >= 3 ? <AlertCircle size={isMobile ? 20 : 24} /> : <CheckCircle size={isMobile ? 20 : 24} />}
              </div>
              <div style={{ flex: 1 }}>
                <span style={{
                  backgroundColor: recommendation.color,
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  fontSize: isMobile ? '12px' : '14px',
                  display: 'inline-block',
                  marginBottom: '8px'
                }}>
                  Score : {score}/15
                </span>
                <h3 style={{
                  fontSize: isMobile ? '16px' : '20px',
                  fontWeight: 'bold',
                  color: recommendation.color,
                  margin: 0,
                  lineHeight: 1.3
                }}>
                  {recommendation.title}
                </h3>
              </div>
            </div>

            <div style={{
              backgroundColor: darkMode ? '#1f2937' : 'white',
              borderRadius: '6px',
              padding: isMobile ? '12px' : '20px',
              marginBottom: '16px'
            }}>
              <p style={{
                color: darkMode ? '#e5e7eb' : '#374151',
                lineHeight: 1.5,
                margin: '0 0 12px 0',
                fontSize: isMobile ? '14px' : '16px'
              }}>
                {recommendation.action}
              </p>

              <h4 style={{
                fontSize: isMobile ? '14px' : '16px',
                fontWeight: 'bold',
                color: darkMode ? 'white' : '#1f2937',
                margin: '0 0 8px 0'
              }}>
                Prochaines étapes recommandées :
              </h4>
              <ol style={{ 
                paddingLeft: '18px', 
                margin: 0,
                fontSize: isMobile ? '13px' : '15px'
              }}>
                {recommendation.steps.map((step, i) => (
                  <li key={i} style={{ 
                    color: darkMode ? '#e5e7eb' : '#374151',
                    lineHeight: 1.5,
                    marginBottom: '6px'
                  }}>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <button
              onClick={copyReport}
              style={{
                width: '100%',
                padding: isMobile ? '12px 16px' : '12px 16px',
                backgroundColor: '#4f46e5',
                color: 'white',
                borderRadius: '6px',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontSize: isMobile ? '14px' : '16px'
              }}
            >
              <Copy size={isMobile ? 16 : 18} />
              {copied ? 'Copié !' : (isMobile ? 'Copier rapport' : 'Copier le rapport')}
            </button>
          </div>
        )}

        {/* Footer */}
        <div style={{ 
          textAlign: 'center', 
          color: darkMode ? '#9ca3af' : '#6b7280',
          fontSize: isMobile ? '12px' : '14px',
          padding: '24px 0 12px 0',
          lineHeight: 1.5
        }}>
          <p style={{ 
            fontWeight: '600', 
            color: darkMode ? '#d1d5db' : '#374151', 
            margin: '0 0 4px 0' 
          }}>
            Kiyali COULIBALY
          </p>
          <p style={{ margin: '0 0 4px 0' }}>Économiste de la santé - CHU Poitiers | Limoges</p>
          <p style={{ margin: '12px 0 0 0' }}>Outil open-source • Version 2.0 • 2025</p>
        </div>
      </div>
    </div>
  );
}