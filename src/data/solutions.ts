export interface Metric {
  value: string;
  label: string;
  detail: string;
}

export interface Feature {
  title: string;
  description: string;
}

export interface WorkflowStep {
  step: string;
  title: string;
  description: string;
}

export interface VelysiumSolution {
  id: string;
  index: string;
  name: string;
  category: string;
  tagline: string;
  shortDescription: string;
  targetAudience: string;
  deploymentType: string;
  securityGuarantee: string;
  tags: string[];
  problemSolved: {
    heading: string;
    description: string;
    bulletPoints: string[];
  };
  solutionOverview: {
    heading: string;
    description: string;
  };
  features: Feature[];
  metrics: Metric[];
  workflow: WorkflowStep[];
  deliverables: string[];
  demoInquiryText: string;
}

export const velysiumSolutions: VelysiumSolution[] = [
  {
    id: "accounting-invoices",
    index: "01",
    name: "Velysium Accounting Invoices",
    category: "Comptabilité & OCR Intelligent",
    tagline: "Automatisation intégrale de la saisie des factures, de l'imputation PCGM et du rapprochement bancaire",
    shortDescription:
      "Suite d'automatisation comptable par OCR intelligent pour cabinets fiduciaires et PME. Scanne automatiquement les dossiers d'achats et de ventes, extrait les montants même depuis des photos smartphone, affecte les comptes PCGM, génère les écritures en partie double et contrôle la balance générale.",
    targetAudience: "Cabinets d'expertise comptable, fiduciaires, directions financières (DAF) et PME",
    deploymentType: "Application Desktop autonome (Windows) — Données hébergées à 100% sur vos postes",
    securityGuarantee: "Zéro fuite cloud : vos données financières et bilans restent sous votre contrôle souverain",
    tags: [
      "OCR Multi-Formats",
      "Conforme PCGM Maroc",
      "Rapprochement Bancaire",
      "Zéro Fuite Cloud",
      "Détection Doublons",
    ],
    problemSolved: {
      heading: "Le Problème dans les Entreprises & Cabinets",
      description:
        "La saisie manuelle des factures et des relevés bancaires représente l'une des charges les plus lourdes et les plus coûteuses pour les équipes comptables. Elle engendre des retards réguliers et des risques fiscaux majeurs :",
      bulletPoints: [
        "Des dizaines d'heures perdues chaque mois à recopier manuellement les montants HT, TVA et TTC des pièces papier et photos reçues par WhatsApp ou email.",
        "Erreurs humaines récurrentes dans les imputations de comptes et le lettrage bancaire, provoquant des écarts au moment du bilan.",
        "Difficulté à réconcilier les factures avec les relevés bancaires et risques de doublons de paiement ou de fausses déclarations de TVA.",
      ],
    },
    solutionOverview: {
      heading: "La Réponse Velysium",
      description:
        "Velysium Accounting Invoices transforme la tenue de comptes en un flux automatisé instantané. Il classe automatiquement les pièces comptables (Achats, Ventes, Relevés, Bordereaux CNSS, Reçus DGI), extrait instantanément les données critiques via un OCR haute précision entraîné sur les modèles de factures marocains, applique la nomenclature du Plan Comptable Général Marocain (PCGM) et produit les écritures en partie double prêtes à être intégrées dans votre logiciel habituel.",
    },
    features: [
      {
        title: "Extraction OCR Haute Précision",
        description:
          "Lit et extrait automatiquement l'ICE, la raison sociale, la date, les montants HT/TVA/TTC même sur des tickets de caisse froissés ou des photos smartphone inclinées.",
      },
      {
        title: "Affectation Automatique PCGM",
        description:
          "Analyse le libellé et l'activité du fournisseur pour suggérer immédiatement les bons comptes de charges (classe 6), TVA récupérable (3455) et comptes fournisseurs (4411).",
      },
      {
        title: "Génération des Écritures en Partie Double",
        description:
          "Construit automatiquement les journaux comptables rigoureusement équilibrés Débit/Crédit et exporte la Balance Générale en format Excel ou texte structuré.",
      },
      {
        title: "Rapprochement Bancaire & Détection Anti-Doublons",
        description:
          "Lettrage automatique entre les lignes du relevé bancaire et les factures fournisseurs enregistrées, avec alerte immédiate en cas de facture déjà saisie.",
      },
      {
        title: "Relances Fournisseurs & Pièces Manquantes",
        description:
          "Identification en temps réel des débits bancaires sans justificatif d'achat associé et génération automatique de fiches de relance client.",
      },
    ],
    metrics: [
      {
        value: "-85%",
        label: "Temps de saisie",
        detail: "Divise par 6 le temps passé sur la saisie manuelle de vos liasses de factures.",
      },
      {
        value: "0 Erreur",
        label: "De calcul ou doublon",
        detail: "Contrôle d'intégrité arithmétique systématique HT + TVA = TTC.",
      },
      {
        value: "100%",
        label: "Souveraineté locale",
        detail: "Aucun serveur tiers, aucun abonnement cloud forcé, stockage sécurisé SQLite.",
      },
    ],
    workflow: [
      {
        step: "01",
        title: "Import & Classement Automatique",
        description: "Déposez vos scans ou photos dans les dossiers surveillés par l'application.",
      },
      {
        step: "02",
        title: "Analyse OCR & Affectation PCGM",
        description: "Le moteur extrait les montants et affecte les comptes comptables réglementaires.",
      },
      {
        step: "03",
        title: "Validation & Export Journal",
        description: "Vérifiez d'un coup d'œil, exportez les écritures et réconciliez les comptes bancaires.",
      },
    ],
    deliverables: [
      "Logiciel exécutable desktop prêt à l'emploi (installation en 1 clic)",
      "Base de données locale chiffrée avec historique illimité",
      "Paramétrage personnalisé de votre plan comptable d'entreprise",
      "Documentation d'utilisation et session de prise en main pour vos équipes",
    ],
    demoInquiryText:
      "Bonjour, je souhaite planifier une démonstration de Velysium Accounting Invoices pour notre cabinet / entreprise et connaître les modalités d'acquisition d'une licence.",
  },
  {
    id: "hr-attestation-manager",
    index: "02",
    name: "Velysium HR & Attestation Suite",
    category: "Ressources Humaines & Conformité",
    tagline: "Édition instantanée d'attestations réglementaires avec QR code d'authentification infalsifiable",
    shortDescription:
      "Plateforme de gestion du personnel et de génération d'attestations officielles (Attestation de Travail, Attestation de Salaire, Attestation de Stage). Génère des documents PDF conformes au Code du Travail marocain avec QR code cryptographique de vérification instantanée et registre centralisé.",
    targetAudience: "Directions des Ressources Humaines (DRH), gestionnaires de paie, cabinets de conseil RH et PME",
    deploymentType: "Application Desktop sécurisée multi-postes (Windows / macOS) avec base de données locale",
    securityGuarantee: "Validation cryptographique garantissant l'intégrité absolue des documents émis",
    tags: [
      "Attestations Officielles",
      "QR Code Anti-Fraude",
      "Conforme Code du Travail",
      "Génération PDFbox",
      "Registre Centralisé",
    ],
    problemSolved: {
      heading: "Le Problème dans la Gestion des Documents RH",
      description:
        "La délivrance des attestations aux employés et stagiaires est souvent traitée de manière artisanale, générant une surcharge inutile pour les équipes RH et des vulnérabilités critiques :",
      bulletPoints: [
        "Temps considérable passé à éditer manuellement des modèles Word ou Excel pour chaque demande de collaborateur.",
        "Fraude et falsification d'attestations de salaire et de travail auprès des organismes bancaires, des consulats et des administrations.",
        "Absence de registre centralisé permettant de savoir quel document a été délivré, à quelle date, et par quel responsable des ressources humaines.",
      ],
    },
    solutionOverview: {
      heading: "La Réponse Velysium",
      description:
        "Velysium HR & Attestation Suite industrialise la production et la certification de tous les documents administratifs de vos employés et stagiaires. En moins de 10 secondes, l'application génère un PDF prêt à l'impression ou à la signature électronique, intégrant les mentions légales obligatoires, la charte graphique de l'entreprise et un QR code unique de validation pour éliminer définitivement toute falsification.",
    },
    features: [
      {
        title: "Catalogue d'Attestations Réglementaires Marocaines",
        description:
          "Modèles préconfigurés et conformes : Attestation de Travail, Attestation de Salaire, Attestation de Stage et Solde de Tout Compte.",
      },
      {
        title: "QR Code Cryptographique Anti-Fraude",
        description:
          "Chaque document comporte une empreinte numérique vérifiable en un scan par les banques, consulats et administrations pour certifier son authenticité.",
      },
      {
        title: "Moteur PDFbox Pixel-Perfect",
        description:
          "Mise en page vectorielle haute définition respectant l'en-tête, le logo, les signatures scannées et les tampons officiels de votre entreprise.",
      },
      {
        title: "Annuaire Centralisé Collaborateurs & Stagiaires",
        description:
          "Fiches complètes avec matricule, CIN, date d'embauche, poste, rémunération et historique de tous les documents délivrés.",
      },
      {
        title: "Prévisualisation en Direct & Export Multiple",
        description:
          "Visualisation immédiate du rendu final avant impression, génération par lots et archivage automatique dans la base locale.",
      },
    ],
    metrics: [
      {
        value: "10s",
        label: "Délai d'édition",
        detail: "Génération et certification d'un document complet en quelques clics.",
      },
      {
        value: "0 Fraude",
        label: "Sécurité garantie",
        detail: "Impossible de modifier les montants ou dates grâce au QR code d'authentification.",
      },
      {
        value: "100%",
        label: "Conformité légale",
        detail: "Clauses et mentions obligatoires alignées sur le droit du travail marocain.",
      },
    ],
    workflow: [
      {
        step: "01",
        title: "Sélection du Collaborateur",
        description: "Recherchez l'employé ou le stagiaire dans l'annuaire d'entreprise en 2 secondes.",
      },
      {
        step: "02",
        title: "Choix du Document & Génération QR",
        description: "Sélectionnez le type d'attestation, le système compose les mentions et le QR code.",
      },
      {
        step: "03",
        title: "Émission & Archivage Automatique",
        description: "Exportez le PDF officiel certifié, l'opération est archivée dans votre journal d'audit.",
      },
    ],
    deliverables: [
      "Application logicielle d'entreprise prête au déploiement",
      "Personnalisation graphique intégrale (logo, charte, tampons de votre société)",
      "Base de données collaborateurs sécurisée avec sauvegarde automatique",
      "Module de vérification publique pour les QR codes certifiés",
    ],
    demoInquiryText:
      "Bonjour, je souhaite planifier une démonstration de Velysium HR & Attestation Suite pour moderniser et sécuriser l'émission de nos documents RH.",
  },
  {
    id: "corporate-legal-suite",
    index: "03",
    name: "Velysium Corporate Legal Suite",
    category: "Droit des Affaires & Gouvernance",
    tagline: "Génération automatisée des statuts d'entreprises, PV d'assemblées générales et conformité légale",
    shortDescription:
      "Suite d'automatisation des actes juridiques d'entreprise selon le droit marocain (SARL, SARL AU, SA, SAS). Rédige instantanément les statuts certifiés, procès-verbaux d'AGO/AGE, décisions de gérance, actes de cession de parts et dossiers d'immatriculation sans omission juridique.",
    targetAudience: "Cabinets d'avocats d'affaires, fiduciaires, notaires, experts-comptables et directions juridiques",
    deploymentType: "Architecture logicielle autonome (Clean Architecture) — Déploiement local ou serveur privé",
    securityGuarantee: "Conformité stricte aux lois 5-96 et 17-95 régissant les sociétés commerciales au Maroc",
    tags: [
      "Statuts SARL / SA / SAS",
      "PV Assemblées AGO & AGE",
      "Conforme Lois 5-96 & 17-95",
      "Zéro Rejet Greffe",
      "Clean Architecture",
    ],
    problemSolved: {
      heading: "Le Défi Juridique dans les Entreprises & Cabinets",
      description:
        "La constitution de sociétés et la tenue de la gouvernance juridique annuelle imposent des formalités rigoureuses où la moindre imprécision coûte cher :",
      bulletPoints: [
        "Heures considérables passées à réécrire des statuts et procès-verbaux d'assemblées générales en adaptant manuellement d'anciens modèles.",
        "Risque de rejets systématiques au tribunal de commerce ou au CRI à cause de clauses mal formulées, de calculs de majorités erronés ou de mentions manquantes.",
        "Difficulté à suivre les formalités post-création : transferts de siège, augmentations de capital, cessions de parts sociales et changements de gérance.",
      ],
    },
    solutionOverview: {
      heading: "La Réponse Velysium",
      description:
        "Velysium Corporate Legal Suite transforme la rédaction juridique en une procédure fluide, fiable et ultra-rapide. Grâce à un moteur guidé intelligent et une architecture rigoureuse, l'application vérifie la cohérence des associés, du capital, des apports et de la répartition des pouvoirs, puis génère l'ensemble de la liasse juridique officielle prête au dépôt.",
    },
    features: [
      {
        title: "Générateur de Statuts Multi-Formes Sociétaires",
        description:
          "Création de statuts complets et personnalisables pour SARL, SARL à Associé Unique, SA avec Conseil d'Administration et SAS.",
      },
      {
        title: "Gouvernance & PV d'Assemblées Générales",
        description:
          "Modèles certifiés d'AGO (approbation des comptes, quitus, affectation du résultat) et d'AGE (transfert de siège social, modification de l'objet, augmentation de capital).",
      },
      {
        title: "Contrôles Automatiques de Validité Juridique",
        description:
          "Vérification automatique de la somme des apports, des pourcentages de détention et du quorum légal exigé par la loi marocaine.",
      },
      {
        title: "Dossier d'Immatriculation & Formalités Complètes",
        description:
          "Génération automatique des déclarations de souscription, des actes de nomination du premier gérant et des pouvoirs de dépôt.",
      },
      {
        title: "Clauses Contractuelles Modulaires",
        description:
          "Insertion facile de clauses spécifiques : clause d'agrément, droit de préemption, gérance collégiale et limitations de pouvoirs.",
      },
    ],
    metrics: [
      {
        value: "-90%",
        label: "Temps de rédaction",
        detail: "Un dossier juridique complet rédigé et vérifié en moins de 15 minutes.",
      },
      {
        value: "0 Rejet",
        label: "Au greffe du tribunal",
        detail: "Standardisation irréprochable éliminant les vices de forme et omissions.",
      },
      {
        value: "100%",
        label: "Droit marocain",
        detail: "Parfaitement conforme aux réformes récentes du droit commercial au Maroc.",
      },
    ],
    workflow: [
      {
        step: "01",
        title: "Questionnaire Guidé Entreprise",
        description: "Renseignez les associés, le capital, l'objet social et les dirigeants.",
      },
      {
        step: "02",
        title: "Contrôle Automatique des Règles",
        description: "Le moteur valide l'équilibre des parts et la cohérence des clauses légales.",
      },
      {
        step: "03",
        title: "Production de la Liasse Juridique",
        description: "Téléchargez les statuts et actes complets prêts pour la signature et le greffe.",
      },
    ],
    deliverables: [
      "Solution logicielle d'automatisation juridique déployable immédiatement",
      "Bibliothèque complète de modèles d'actes d'entreprises selon le droit marocain",
      "Mises à jour réglementaires lors de toute modification législative",
      "Formation de vos collaborateurs ou juristes internes",
    ],
    demoInquiryText:
      "Bonjour, nous souhaitons une présentation de Velysium Corporate Legal Suite pour automatiser la rédaction des statuts et PV d'assemblées dans notre structure.",
  },
  {
    id: "enterprise-ai-workforce",
    index: "04",
    name: "Velysium Enterprise AI Workforce",
    category: "Intelligence Artificielle & Automatisation",
    tagline: "Flotte d'agents IA autonomes spécialisés pour exécuter vos opérations et traitements documentaires",
    shortDescription:
      "Déploiement d'agents d'intelligence artificielle dédiés aux tâches cognitives répétitives des entreprises : analyse documentaire, synthèses réglementaires, traitement des courriers et emails entrants, qualification commerciale et veille stratégique automatisée.",
    targetAudience: "Directions générales, banques, assurances, centres de services partagés et PME en forte croissance",
    deploymentType: "Déploiement souverain sur infrastructure privée (Cloud dédié ou On-Premise) connecté à votre SI",
    securityGuarantee: "Isolation absolue de vos données d'entreprise — Aucun modèle public n'est entraîné avec vos secrets",
    tags: [
      "Agents Autonomes",
      "Traitement Documentaire",
      "330+ Compétences Métiers",
      "IA Souveraine",
      "Garde-Fous Zéro Hallucination",
    ],
    problemSolved: {
      heading: "Le Problème de Productivité Opérationnelle",
      description:
        "Dans la plupart des organisations, des collaborateurs hautement qualifiés passent jusqu'à 40% de leur journée sur des tâches répétitives à faible valeur ajoutée :",
      bulletPoints: [
        "Lecture, tri et extraction manuelle d'informations dans des centaines d'emails, rapports PDF et pièces jointes non structurées.",
        "Temps de réponse trop long aux demandes de devis, questions fréquentes des clients ou demandes internes de conformité.",
        "L'utilisation non encadrée d'outils d'IA grand public (ChatGPT) qui fait fuiter des données stratégiques et confidentielles vers des serveurs étrangers.",
      ],
    },
    solutionOverview: {
      heading: "La Réponse Velysium",
      description:
        "Velysium Enterprise AI Workforce fournit une armada d'agents IA spécialisés, formés et bridés pour exécuter vos procédures d'entreprise avec une rigueur absolue. Connectés à vos bases documentaires internes, ils travaillent 24/7 dans un environnement hermétique, rédigent vos synthèses, préparent les livrables et soumettent les décisions complexes à vos équipes pour validation finale.",
    },
    features: [
      {
        title: "Agents Métiers Spécialisés",
        description:
          "Agents configurés sur-mesure pour vos départements : Agent Finance (contrôle de devis/factures), Agent Juridique (analyse de clauses), Agent Support (réponses qualifiées).",
      },
      {
        title: "Recherche Sémantique & Synthèse de Connaissances",
        description:
          "Posez n'importe quelle question en langage naturel à l'ensemble de votre patrimoine documentaire (procédures internes, contrats, historiques de dossiers).",
      },
      {
        title: "330+ Workflows d'Entreprise Pré-configurés",
        description:
          "Protocoles testés pour la rédaction de comptes-rendus, la détection d'incohérences contractuelles, le scoring de leads et la veille concurrentielle.",
      },
      {
        title: "Environnement d'Exécution Souverain & Chiffré",
        description:
          "Vos documents, requêtes et analyses ne quittent jamais votre infrastructure sécurisée et ne sont jamais réutilisés par des tiers.",
      },
      {
        title: "Validation Humaine (Human-in-the-Loop)",
        description:
          "Garde-fous stricts : l'agent prépare le travail et propose des actions concrètes, mais vos collaborateurs conservent le contrôle et la signature finale.",
      },
    ],
    metrics: [
      {
        value: "x5",
        label: "Vitesse d'exécution",
        detail: "Traitement des synthèses documentaires et réponses courantes 5 fois plus rapide.",
      },
      {
        value: "70%",
        label: "Des tâches automatisées",
        detail: "Libère vos collaborateurs des corvées de saisie, tri et recherches fastidieuses.",
      },
      {
        value: "24/7",
        label: "Disponibilité continue",
        detail: "Fonctionnement permanent sans interruption ni fatigue opérationnelle.",
      },
    ],
    workflow: [
      {
        step: "01",
        title: "Connexion aux Données Métier",
        description: "L'agent est connecté à vos répertoires internes de manière cloisonnée et chiffrée.",
      },
      {
        step: "02",
        title: "Exécution Autonome des Protocoles",
        description: "L'agent analyse les flux entrants, extrait l'information utile et rédige les synthèses.",
      },
      {
        step: "03",
        title: "Validation & Intégration Finale",
        description: "Vos collaborateurs reçoivent le travail préparé et le valident en un clic.",
      },
    ],
    deliverables: [
      "Déploiement clé en main des agents IA sur votre infrastructure choisie",
      "Indexation et sécurisation de votre base de connaissances d'entreprise",
      "Mise en place de tableaux de bord de supervision et de contrôle",
      "Accompagnement au changement et formation pratique des équipes utilisatrices",
    ],
    demoInquiryText:
      "Bonjour, je souhaite découvrir une démonstration de Velysium Enterprise AI Workforce et étudier son intégration dans nos processus métiers.",
  },
  {
    id: "cyber-exposure-audit",
    index: "05",
    name: "Velysium Cyber Exposure & Audit",
    category: "Cybersécurité & Threat Intelligence",
    tagline: "Cartographie de la surface d'attaque externe et détection proactive des fuites d'identifiants d'entreprise",
    shortDescription:
      "Solution d'audit de surface d'attaque externe et d'empreinte numérique pour les entreprises. Scanne plus de 285 canaux d'investigation (OSINT) pour détecter les identifiants d'employés compromis sur le web et le darknet, les sous-domaines vulnérables et les risques de phishing ciblé.",
    targetAudience: "Directions des Systèmes d'Information (DSI), Responsables Sécurité (RSSI) et directions générales",
    deploymentType: "Console d'audit autonome — Exécution ponctuelle ou surveillance périodique programmée",
    securityGuarantee: "Méthodologie passive et non-intrusive respectant les réglementations CNDP et RGPD",
    tags: [
      "285+ Canaux OSINT",
      "Détection Fuites Darknet",
      "Protection Anti-Phishing",
      "Rapport Exécutif DSI",
      "Audit Non-Intrusif",
    ],
    problemSolved: {
      heading: "La Vulnérabilité Invisible des Entreprises",
      description:
        "Plus de 80% des intrusions informatiques et attaques par ransomware débutent par des identifiants professionnels divulgués sur le web ou des services d'entreprise mal configurés :",
      bulletPoints: [
        "Les employés utilisent souvent leur email professionnel pour s'inscrire sur des plateformes tierces qui subissent ensuite des fuites de données massives.",
        "Les pirates cartographient l'empreinte publique de votre entreprise pour monter des attaques d'ingénierie sociale ciblées (usurpation d'identité de dirigeants, faux ordres de virement).",
        "Absence de visibilité en temps réel sur les services, serveurs de messagerie et sous-domaines oubliés exposés publiquement sur internet.",
      ],
    },
    solutionOverview: {
      heading: "La Réponse Velysium",
      description:
        "Velysium Cyber Exposure & Audit agit comme le radar de sécurité avancé de votre organisation. En analysant plus de 285 vecteurs d'information publics (100+ canaux de messagerie et 185+ canaux d'empreinte numérique), l'application dresse une cartographie exhaustive de votre exposition extérieure, vous alerte immédiatement en cas d'identifiant compromis et fournit un plan de remédiation technique concret.",
    },
    features: [
      {
        title: "285+ Vecteurs d'Investigation Numérique (OSINT)",
        description:
          "Scan multi-sources couvrant les serveurs de messagerie, les bases de données de brèches mondiales, les certificats SSL et les dépôts de code.",
      },
      {
        title: "Alerte Précoce de Fuite d'Identifiants",
        description:
          "Détection immédiate dès qu'une adresse email @votre-entreprise.com ou un mot de passe associé apparaît dans un leak public ou darknet.",
      },
      {
        title: "Cartographie de la Surface Externe (EASM)",
        description:
          "Inventaire automatique de tous les domaines, sous-domaines, ports ouverts et technologies web visibles depuis l'extérieur.",
      },
      {
        title: "Rapport Exécutif Direction & Plan d'Action Technique",
        description:
          "Restitution claire : note globale de risque pour le comité de direction et fiches de remédiation détaillées pour l'équipe informatique.",
      },
      {
        title: "Méthode Passive 100% Sans Risque",
        description:
          "Aucun test d'intrusion destructif : la collecte est totalement passive et ne perturbe en aucun cas la production de vos serveurs.",
      },
    ],
    metrics: [
      {
        value: "285+",
        label: "Canaux surveillés",
        detail: "Couverture exhaustive des sources de données et d'empreintes numériques.",
      },
      {
        value: "-90%",
        label: "Risque de phishing réussi",
        detail: "Suppression des identifiants vulnérables avant qu'ils ne soient exploités.",
      },
      {
        value: "< 1h",
        label: "Temps d'audit initial",
        detail: "Diagnostic complet de la surface externe généré rapidement.",
      },
    ],
    workflow: [
      {
        step: "01",
        title: "Périmètre de Votre Organisation",
        description: "Indiquez les noms de domaine et la nomenclature des emails de votre entreprise.",
      },
      {
        step: "02",
        title: "Scan & Rapprochement des Brèches",
        description: "L'application interroge les 285 vecteurs et détecte les expositions critiques.",
      },
      {
        step: "03",
        title: "Rapport d'Audit & Remédiation",
        description: "Consultez le rapport chiffré et révoquez immédiatement les accès exposés.",
      },
    ],
    deliverables: [
      "Console d'audit de sécurité prête à l'emploi",
      "Rapport complet de diagnostic d'exposition externe de votre entreprise",
      "Plan de remédiation priorisé et fiches de bonnes pratiques de sécurité",
      "Accompagnement à la sécurisation des accès par nos experts",
    ],
    demoInquiryText:
      "Bonjour, nous souhaitons réaliser un audit de surface d'exposition externe et découvrir la solution Velysium Cyber Exposure pour notre organisation.",
  },
];
