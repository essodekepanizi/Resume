# Essodéké PANIZI — Vitrine personnelle

**Live :** https://essodekepanizi.github.io/Resume

## Structure du repo

```
Resume/
├── index.html              # Structure HTML (squelette statique)
├── assets/
│   ├── css/
│   │   └── style.css       # Tous les styles
│   └── js/
│       └── main.js         # Logique JS — lit les JSON et rend la page
├── data/
│   ├── content.fr.json     # Contenu français
│   └── content.en.json     # Contenu anglais
└── README.md
```

## Modifier le contenu

**Tout le contenu est dans `/data/content.fr.json` et `/data/content.en.json`.**

Tu n'as jamais besoin de toucher au HTML ou au JS pour mettre à jour tes infos.

### Exemples de modifications courantes

**Changer ta bio :**
```json
"profil": {
  "bio": "Nouvelle bio ici..."
}
```

**Ajouter une expérience :**
```json
{
  "id": 7,
  "entreprise": "Nouvelle Entreprise",
  "titre": "Mon Nouveau Poste",
  "date_debut": "2026-01-01",
  "date_fin": null,
  "description": ["Description du poste..."],
  "tags": ["Tag1", "Tag2"]
}
```

**Ajouter un article de blog :**
```json
{
  "id": 4,
  "titre": "Mon nouvel article",
  "extrait": "Résumé de l'article...",
  "date": "2026-06-01",
  "statut": "publie",
  "slug": "mon-nouvel-article"
}
```

### Valeurs calculées automatiquement

Les durées de poste sont calculées automatiquement depuis `date_debut` et `date_fin`.  
- `date_fin: null` = poste actuel → durée calculée jusqu'à aujourd'hui  
- Le footer affiche automatiquement l'année courante

## Déployer une mise à jour

```bash
git add .
git commit -m "Mise à jour : [description]"
git push origin main
```

Le site se met à jour en ~30 secondes.

## Configuration GitHub Pages

1. Aller dans **Settings** → **Pages**
2. Source : **Deploy from a branch**
3. Branch : **main** / **(root)**
4. Sauvegarder

## Prochaines étapes

- [ ] Migration vers Supabase (contenu dynamique sans JSON)
- [ ] Blog sur leblogdulogisticien.com (nouveau domaine à trouver)
- [ ] Interface admin pour gérer le contenu sans toucher au code
- [ ] Formulaire de contact fonctionnel
