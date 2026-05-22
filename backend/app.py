from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

import pickle
import warnings
import numpy as np

warnings.filterwarnings("ignore")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

clf_model = pickle.load(open("models/clf_random_forest.pkl", "rb"))
scaler = pickle.load(open("models/scaler.pkl", "rb"))
label_encoder = pickle.load(open("models/label_encoder.pkl", "rb"))
vec = pickle.load(open("models/tfidf_vectorizer.pkl", "rb"))
svm = pickle.load(open("models/clf_multimodal_svm.pkl", "rb"))
reg_model = pickle.load(open("models/reg_gradient_boosting.pkl", "rb"))

PHYS_POSITIONS = [0, 1, 3, 4, 8]
NEUTRAL_VALUES = [0.0, 0.0, -0.0011508073232014183, -0.001150389044517708,
                  0.22446351931330472, 0.2526466380543634, 0.05407725321888412,
                  0.2429184549356223, 0.22589413447782547]
NEUTRAL_POS = [2, 7, 5, 6, 9, 10, 11, 12, 13]

MATERIAL_PROFILES = {
    "Métal":     [2.0, 0.3, 2.0, 0.1, 0.8],
    "Verre":     [0.5, 0.5, 0.05, 0.2, 0.8],
    "Plastique": [0.05, 0.5, 0.01, 0.5, 0.5],
    "Papier":    [0.1, 0.5, 0.01, 0.8, 0.2],
}
FEATURE_WEIGHTS = np.array([1.0, 0.5, 3.0, 0.5, 0.8])

class WasteInput(BaseModel):
    poids: float
    volume: float
    conductivite: float
    opacite: float
    rigidite: float
    description: str = ""

def build_scaled_14(poids, volume, conductivite, opacite, rigidite):
    phys = [poids, volume, conductivite, opacite, rigidite]
    raw_14 = np.zeros((1, 14))
    for i, pos in enumerate(PHYS_POSITIONS):
        raw_14[0, pos] = phys[i]
    for i, pos in enumerate(NEUTRAL_POS):
        raw_14[0, pos] = NEUTRAL_VALUES[i]
    return scaler.transform(raw_14)

def predict_price(poids, volume, conductivite, opacite, rigidite):
    scaled_14 = build_scaled_14(poids, volume, conductivite, opacite, rigidite)
    prix = reg_model.predict(scaled_14)[0]
    return round(float(prix), 2)

def classify_physical(poids, volume, conductivite, opacite, rigidite):
    phys = np.array([poids, volume, conductivite, opacite, rigidite])
    best = None
    best_score = float("inf")
    for material, centroid in MATERIAL_PROFILES.items():
        dist = np.sum(FEATURE_WEIGHTS * (phys - np.array(centroid))**2)
        if dist < best_score:
            best_score = dist
            best = material
    return best

@app.get("/health")
def health():
    return {"message": "EcoSmart API running"}

@app.post("/predict")
def predict(data: WasteInput):
    label = classify_physical(data.poids, data.volume, data.conductivite, data.opacite, data.rigidite)
    prix = predict_price(data.poids, data.volume, data.conductivite, data.opacite, data.rigidite)
    return {"prediction": label, "mode": "physique", "prix_revente": prix}

@app.post("/predict-text")
def predict_text(data: WasteInput):
    if not data.description.strip():
        return predict(data)

    tfidf = vec.transform([data.description]).toarray()
    scaled_14 = build_scaled_14(data.poids, data.volume, data.conductivite, data.opacite, data.rigidite)

    svm_input = np.concatenate([tfidf, scaled_14], axis=1)
    prediction = svm.predict(svm_input)
    label = label_encoder.inverse_transform(prediction)
    prix = predict_price(data.poids, data.volume, data.conductivite, data.opacite, data.rigidite)

    return {"prediction": str(label[0]), "mode": "texte+capteurs", "prix_revente": prix}

class NLPInput(BaseModel):
    description: str

TEXT_KEYWORDS = {
    "Métal":     ["metal","métal","métallique","canette","aluminium","fer","acier","conserve","boîte","boite","cannette","fonte","inox"],
    "Verre":     ["verre","bocal","vitre","pot en verre","miroir","carafe","flacon en verre"],
    "Plastique": ["plastique","bouteille","sac","emballage","sachet","film","polystyrène","tupperware","barquette","bidon"],
    "Papier":    ["papier","carton","journal","magazine","feuille","cahier","enveloppe","livre","brique"],
}

@app.post("/predict-nlp")
def predict_nlp(data: NLPInput):
    desc = data.description.strip()
    if not desc:
        return {"prediction": "Inconnu", "mode": "nlp"}

    desc_lower = desc.lower()
    scores = {mat: 0 for mat in TEXT_KEYWORDS}
    for mat, kws in TEXT_KEYWORDS.items():
        for kw in kws:
            if kw in desc_lower:
                scores[mat] += 1

    best = max(scores, key=scores.get)
    if scores[best] == 0:
        return {"prediction": "Inconnu", "mode": "nlp"}

    return {"prediction": best, "mode": "nlp", "prix_revente": None}

app.mount("/", StaticFiles(directory="../frontend/dist", html=True), name="frontend")
