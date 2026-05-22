import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Cell, PieChart, Pie,
} from "recharts";
import "./Dashboard.css";

const COLORS = {
  Plastique: "#22d3ee",
  Verre: "#a78bfa",
  Papier: "#34d399",
  Métal: "#fb923c",
};

const SOURCE_COLORS = {
  Collecte_Citoyenne: "#f472b6",
  Usine_A: "#38bdf8",
  Centre_Tri: "#facc15",
  Usine_B: "#4ade80",
};

const TOTAL_ROWS = 10500;
const LABELED_ROWS = 9986;

const categoryDist = [
  { name: "Plastique", count: 2795, pct: 27.97 },
  { name: "Verre", count: 2586, pct: 25.90 },
  { name: "Papier", count: 2318, pct: 23.20 },
  { name: "Métal", count: 2287, pct: 22.90 },
];

const sourceDist = [
  { name: "Collecte_Citoyenne", count: 2644 },
  { name: "Usine_A", count: 2561 },
  { name: "Centre_Tri", count: 2405 },
  { name: "Usine_B", count: 2354 },
];

const missingPct = [
  { col: "Opacite", pct: 9.86 },
  { col: "Poids", pct: 9.80 },
  { col: "Conductivite", pct: 9.69 },
  { col: "Categorie", pct: 4.90 },
  { col: "Rigidite", pct: 5.31 },
  { col: "Volume", pct: 5.14 },
  { col: "Prix_Revente", pct: 5.10 },
  { col: "Source", pct: 5.10 },
];

const statsByCategory = [
  { cat: "Métal", Poids: 63.50, Volume: 120.89, Conductivite: 0.89, Opacite: 1.56, Rigidite: 8.55, Prix_Revente: 17.76 },
  { cat: "Papier", Poids: 14.67, Volume: 32.95, Conductivite: 0.00, Opacite: 1.26, Rigidite: 2.01, Prix_Revente: 46.07 },
  { cat: "Plastique", Poids: 29.87, Volume: 58.51, Conductivite: 0.00, Opacite: 0.95, Rigidite: 3.98, Prix_Revente: 37.07 },
  { cat: "Verre", Poids: 198.27, Volume: 358.90, Conductivite: 0.00, Opacite: 0.94, Rigidite: 9.10, Prix_Revente: 130.86 },
];

const sourceByCategory = [
  { source: "Centre_Tri", Métal: 562, Papier: 498, Plastique: 667, Verre: 548 },
  { source: "Collecte_Citoyenne", Métal: 589, Papier: 600, Plastique: 744, Verre: 580 },
  { source: "Usine_A", Métal: 528, Papier: 547, Plastique: 654, Verre: 716 },
  { source: "Usine_B", Métal: 499, Papier: 548, Plastique: 596, Verre: 599 },
];

const corrPairs = [
  { x: "Poids", y: "Volume", r: 0.584 },
  { x: "Volume", y: "Rigidite", r: 0.733 },
  { x: "Poids", y: "Rigidite", r: 0.442 },
  { x: "Conduct", y: "Rigidite", r: 0.477 },
  { x: "Poids", y: "Conductivite", r: -0.060 },
  { x: "Poids", y: "Prix", r: 0.049 },
  { x: "Volume", y: "Prix", r: 0.072 },
  { x: "Opacite", y: "Rigidite", r: 0.004 },
];

const modules = [
  { id: "M1", label: "Data Engineering", detail: "EDA · Imputation · Outliers · Feature Eng.", icon: "⚙️" },
  { id: "M2", label: "Supervised ML", detail: "Classification (RF, SVM, XGBoost) · Regression (Ridge)", icon: "🤖" },
  { id: "M3", label: "Unsupervised Clustering", detail: "KMeans · PCA · Silhouette", icon: "🔵" },
  { id: "M4", label: "NLP Pipeline", detail: "TF-IDF · Bag-of-Words · Naïve Bayes", icon: "📝" },
  { id: "M5", label: "Multimodal Pipeline", detail: "Fusion Numérique + NLP · Sparse hstack", icon: "🔀" },
];

const imputationStrategies = [
  { name: "Médiane", pros: "Rapide, robuste aux outliers", cons: "Ignore les corrélations" },
  { name: "KNN", pros: "Exploite les voisins similaires", cons: "Coût O(n²)" },
  { name: "MICE", pros: "Modèle complet par variable", cons: "Lent, complexe" },
];

const radarData = [
  { feature: "Poids", Métal: 32, Papier: 7, Plastique: 15, Verre: 100 },
  { feature: "Volume", Métal: 34, Papier: 9, Plastique: 16, Verre: 100 },
  { feature: "Conduc", Métal: 98, Papier: 0, Plastique: 0, Verre: 0 },
  { feature: "Opacite", Métal: 100, Papier: 81, Plastique: 61, Verre: 60 },
  { feature: "Rigidite", Métal: 94, Papier: 22, Plastique: 44, Verre: 100 },
  { feature: "Prix", Métal: 14, Papier: 35, Plastique: 28, Verre: 100 },
];

function KPICard({ label, value, sub, color = "var(--cyan-400)" }) {
  return (
    <div className="db-card" style={{ padding: "20px 24px" }}>
      <span className="db-kpi-label">{label}</span>
      <span className="db-kpi-value" style={{ color }}>{value}</span>
      {sub && <span className="db-kpi-sub">{sub}</span>}
    </div>
  );
}

function SectionHeader({ title, badge }) {
  return (
    <div className="db-section-header">
      <div className="db-section-accent" />
      <h2 className="db-section-title">{title}</h2>
      {badge && <span className="db-section-badge">{badge}</span>}
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="db-tooltip">
      <p className="db-tooltip-label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="db-tooltip-item" style={{ color: p.color || "var(--text)" }}>
          {p.name}: <b>{typeof p.value === "number" ? p.value.toFixed(1) : p.value}</b>
        </p>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Vue Générale" },
    { id: "features", label: "Features" },
    { id: "pipeline", label: "Pipeline ML" },
  ];

  return (
    <div className="db-wrapper">
      <div className="db-header">
        <div className="db-header-top">
          <div>
            <div className="db-header-title-row">
              <span className="db-header-icon">🌱</span>
              <h1 className="db-header-title">
                EcoSmart <span className="db-header-title-accent">Classifier</span>
              </h1>
            </div>
            <p className="db-header-sub">
              Projet Machine Learning 2026 — Pipeline de classification de déchets recyclables
            </p>
          </div>
          <div className="db-header-tags">
            {["Recyclage", "ML Supervisé", "NLP", "Clustering"].map(t => (
              <span key={t} className="db-header-tag">{t}</span>
            ))}
          </div>
        </div>

        <div className="db-tabs">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`db-tab ${activeTab === t.id ? "db-tab-active" : ""}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="db-content">
        {activeTab === "overview" && (
          <div className="db-section-group">
            <div className="db-kpi-grid">
              <KPICard label="Total Échantillons" value="10 500" sub="lignes × 9 colonnes" />
              <KPICard label="Classes Cibles" value="4" sub="Plastique · Verre · Papier · Métal" color="var(--purple-500)" />
              <KPICard label="Features Numériques" value="6" sub="Poids, Volume, Conductivité…" color="var(--green-400)" />
              <KPICard label="Labels Manquants" value="514" sub={`${(514/10500*100).toFixed(1)}% — MNAR probable`} color="var(--amber-400)" />
            </div>

            <div className="db-grid-2">
              <div className="db-card db-card-padded">
                <SectionHeader title="Distribution des Catégories" badge="Étiquetées" />
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={categoryDist} dataKey="count" nameKey="name" cx="40%" cy="50%" outerRadius={90} paddingAngle={3} label={({ name, pct }) => `${name} ${pct}%`} labelLine={{ stroke: "var(--border)" }}>
                      {categoryDist.map(d => <Cell key={d.name} fill={COLORS[d.name]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="db-card db-card-padded">
                <SectionHeader title="Distribution des Sources" badge="4 sources" />
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={sourceDist} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" tick={{ fill: "var(--text-dim)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "var(--text-dimmer)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {sourceDist.map(d => <Cell key={d.name} fill={SOURCE_COLORS[d.name]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="db-card db-card-padded">
              <SectionHeader title="Taux de Valeurs Manquantes par Colonne" badge="% NaN" />
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={missingPct} layout="vertical" margin={{ left: 60, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis type="number" domain={[0, 12]} tickFormatter={v => `${v}%`} tick={{ fill: "var(--text-dimmer)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="col" tick={{ fill: "var(--text-dim)", fontSize: 12, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} formatter={v => [`${v}%`, "Manquants"]} />
                  <Bar dataKey="pct" fill="#fb923c" opacity={0.8} radius={[0, 4, 4, 0]} background={{ fill: "var(--bg-input)", radius: 4 }} />
                </BarChart>
              </ResponsiveContainer>
              <p className="db-insight">
                Opacite, Poids et Conductivite ont les taux les plus élevés (~9.8%). Rapport_Collecte est complet à 100%.
              </p>
            </div>

            <div className="db-card db-card-padded">
              <SectionHeader title="Catégories par Source de Collecte" />
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={sourceByCategory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="source" tick={{ fill: "var(--text-dim)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "var(--text-dimmer)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, color: "var(--text-dim)" }} />
                  {["Métal", "Papier", "Plastique", "Verre"].map(cat => (
                    <Bar key={cat} dataKey={cat} stackId="a" fill={COLORS[cat]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === "features" && (
          <div className="db-section-group">
            <div className="db-card db-card-padded">
              <SectionHeader title="Statistiques Moyennes par Catégorie" badge="µ par classe" />
              <div className="db-table-wrap">
                <table className="db-table">
                  <thead>
                    <tr>
                      {["Catégorie", "Poids (kg)", "Volume (L)", "Conductivité", "Opacité", "Rigidité", "Prix (€)"].map(h => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {statsByCategory.map((row, i) => (
                      <tr key={row.cat} className={i % 2 === 0 ? "" : "db-row-alt"}>
                        <td>
                          <span className="db-cat-cell">
                            <span className="db-cat-dot" style={{ background: COLORS[row.cat] }} />
                            <b style={{ color: COLORS[row.cat] }}>{row.cat}</b>
                          </span>
                        </td>
                        {[row.Poids, row.Volume, row.Conductivite, row.Opacite, row.Rigidite, row.Prix_Revente].map((v, j) => (
                          <td key={j} className="db-mono">{v.toFixed(2)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="db-grid-2">
              <div className="db-card db-card-padded">
                <SectionHeader title="Profil Normalisé par Classe" badge="Radar" />
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="var(--border)" />
                    <PolarAngleAxis dataKey="feature" tick={{ fill: "var(--text-dim)", fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    {["Métal", "Papier", "Plastique", "Verre"].map(cat => (
                      <Radar key={cat} name={cat} dataKey={cat} stroke={COLORS[cat]} fill={COLORS[cat]} fillOpacity={0.12} />
                    ))}
                    <Legend wrapperStyle={{ fontSize: 12, color: "var(--text-dim)" }} />
                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="db-card db-card-padded">
                <SectionHeader title="Prix de Revente Moyen (€)" badge="par classe" />
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={statsByCategory} margin={{ top: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="cat" tick={{ fill: "var(--text-dim)", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "var(--text-dimmer)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="Prix_Revente" name="Prix (€)" radius={[6, 6, 0, 0]}>
                      {statsByCategory.map(d => <Cell key={d.cat} fill={COLORS[d.cat]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <p className="db-insight">
                  Le Verre a un prix moyen bien au-dessus des autres (130 €), suivi du Papier (46 €).
                </p>
              </div>
            </div>

            <div className="db-card db-card-padded">
              <SectionHeader title="Corrélations entre Features Numériques" badge="Pearson r" />
              <div className="db-corr-grid">
                {corrPairs.map(p => {
                  const abs = Math.abs(p.r);
                  const isPos = p.r >= 0;
                  const bg = isPos
                    ? `rgba(34,211,238,${abs * 0.8})`
                    : `rgba(251,146,60,${abs * 0.8})`;
                  return (
                    <div key={p.x + p.y} className="db-corr-card" style={{ background: bg, borderColor: isPos ? "rgba(34,211,238,0.3)" : "rgba(251,146,60,0.3)" }}>
                      <div className="db-corr-label">{p.x} ↔ {p.y}</div>
                      <div className="db-corr-value">{p.r > 0 ? "+" : ""}{p.r.toFixed(3)}</div>
                      <div className="db-corr-desc">
                        {isPos ? "corrélation positive" : "corrélation négative"} {abs < 0.2 ? "· faible" : abs < 0.6 ? "· modérée" : "· forte"}
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="db-insight">
                Volume–Rigidite (r=0.733) et Poids–Volume (r=0.584) montrent les corrélations les plus fortes.
              </p>
            </div>
          </div>
        )}

        {activeTab === "pipeline" && (
          <div className="db-section-group">
            <div>
              <SectionHeader title="Architecture du Pipeline" badge="5 modules" />
              <div className="db-module-list">
                {modules.map((m, i) => (
                  <div key={m.id} className="db-module-card">
                    <div className="db-module-icon-wrap">
                      {m.icon}
                    </div>
                    <div className="db-module-info">
                      <div className="db-module-title-row">
                        <span className="db-module-id">{m.id}</span>
                        <span className="db-module-label">{m.label}</span>
                      </div>
                      <p className="db-module-detail">{m.detail}</p>
                    </div>
                    {i < modules.length - 1 && <div className="db-module-arrow">→</div>}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <SectionHeader title="Stratégies d'Imputation Comparées" badge="Module 1" />
              <div className="db-grid-3">
                {imputationStrategies.map((s, i) => {
                  const colors = ["var(--cyan-400)", "var(--purple-500)", "var(--green-400)"];
                  return (
                    <div key={s.name} className="db-imp-card" style={{ borderColor: colors[i] + "33" }}>
                      <div className="db-imp-title" style={{ color: colors[i] }}>{s.name}</div>
                      <div className="db-imp-block">
                        <span className="db-imp-pros-label">✓ Avantages</span>
                        <p className="db-imp-text">{s.pros}</p>
                      </div>
                      <div className="db-imp-block">
                        <span className="db-imp-cons-label">✗ Limites</span>
                        <p className="db-imp-text">{s.cons}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="db-card db-card-padded">
              <SectionHeader title="Modèles Utilisés" badge="ML Supervisé + NLP" />
              <div className="db-grid-2">
                {[
                  { task: "Classification", models: ["Random Forest", "XGBoost", "LightGBM", "Logistic Regression", "LinearSVC", "Gradient Boosting"] },
                  { task: "Régression (Prix_Revente)", models: ["Random Forest Regressor", "Ridge Regression"] },
                  { task: "Clustering", models: ["KMeans (k=4)", "PCA → visualisation 2D"] },
                  { task: "NLP (Rapport_Collecte)", models: ["TF-IDF + MultinomialNB", "CountVectorizer + LogReg", "Fusion Numérique + NLP (sparse hstack)"] },
                ].map(block => (
                  <div key={block.task} className="db-model-block">
                    <p className="db-model-task">{block.task}</p>
                    <ul className="db-model-list">
                      {block.models.map(m => (
                        <li key={m}>{m}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="db-warning-card">
              <p className="db-warning-title">⚠️ Mécanisme de Données Manquantes (Module 1.2)</p>
              <p className="db-warning-text">
                Un test de Mann-Whitney a été appliqué pour distinguer MCAR, MAR et MNAR.
                Les colonnes <b>Poids / Opacite / Conductivite</b> sont suspectées <b className="db-warning-highlight">MAR</b> (dépendantes d'autres variables).
                La colonne <b>Categorie</b> est suspectée <b className="db-warning-highlight">MNAR</b> (les labels manquent de façon structurelle).
                L'imputation recommandée est le <b className="db-warning-accent">KNN Imputer</b> pour les features numériques.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
