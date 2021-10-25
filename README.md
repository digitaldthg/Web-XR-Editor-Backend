# WebXR Editor
Mit dem WebXR Editor können angemeldete User 3D Projekte anlegen, gestalten und in XR-fähigen Browser ansehen.

Dieser Prototyp ist im Rahmen des Forschungsprojekts "Im/material Theatre Spaces" entstanden. Weitere Informationen zum Projekt finden Sie [hier](https://digital.dthg.de/).

## Projektaufbau
Das Projekt wurde mit [Vue 2](https://vuejs.org/) entwickelt und nutzt [three.js](https://threejs.org/) als WebGL Framework sowie das npm-package [three-mesh-ui](https://www.npmjs.com/package/three-mesh-ui) für die Darstellung von Text im 3D Raum. Als Backend wird das headless CMS Strapi genutzt. Eine Demo des WebXR Editors finden Sie [hier](http://developer.digital.dthg.de/tpXR/).

```
Login
|
└─── Home
      |
      └─── Projektübersicht
            |
            Projekt
            |
            └─── Editor/:id/:slideContainerIndex?/:slideIndex?
```

**Projekt** - ist eine Sammlung aus ein oder mehreren SlideContainer.
- Name - <em>Text</em>
- Description - <em>Formatierter Text</em>
- slide_containers - <em>Beziehung mit SlideContainer</em>

**SlideContainer** - enthält ein oder mehrere Slides
- Name - <em>Text</em>
- SlideContainerOffset - <em>Komponent: x (Zahl), y(Zahl), z(Zahl)</em>
- Slides - <em>Beziehung mit Slide</em>
- PreviewImage - <em>Bild</em>

**Slide** - eine 3D Szene die ein oder mehrere 3D Modelle enthalten kann
- Name - <em>Text</em>
- SlideContainerOffset - <em>Komponent: x (Zahl), y(Zahl), z(Zahl)</em>
- PreviewImage - <em>Bild</em>
- CameraPosition - <em>Komponent: x (Zahl), y(Zahl), z(Zahl)</em>
- CameraOffset - <em>Komponent: x (Zahl), y(Zahl), z(Zahl)</em>
- SlideTemplate - <em>Beziehung mit SlideTemplate</em>
- Slides - <em>Beziehung mit Slide</em>
- SlideElement - <em>Beziehung mit SlideElement</em>

**SlideElement** 
- Name - <em>Text</em>
- Scale - <em>Komponent: x (Zahl), y(Zahl), z(Zahl)</em>
- Offset - <em>Komponent: x (Zahl), y(Zahl), z(Zahl)</em>
- Rotation - <em>Komponent: x (Zahl), y(Zahl), z(Zahl), w(Zahl)</em>
- SlideElement - <em>Beziehung mit SlideElement</em>

**SlideTemplate** - kann für keiner, einer oder mehreren Slides zugeorndet werden
- Name - <em>Text</em>
- BackgroundColor - <em>Text</em>
- FontSize - <em>Zahl</em>

# Editorfunktionen
### Navigation
**Transform**

Ändert die Transform Eigenschaft des Gizmos für das selektierte Objekt: Translate | Scale | Rotation das Gizmo 

**Primitives**

Fügt das jeweilig ausgewählte Primitive der Szene hinzu

**TextElement**

Fügt ein Text-Element der Szene hinzu

**Slides**

Zeigt alle im SlideContainer enthaltenen Slides an

**Sidebar**
- **Hierarchie** 
  - listet alle Objekte innerhalb eines Slides auf
  
- 3D Objekt 
  - Zeigt alle verfügbaren Parameter eines Objektes an
- Slide
  - Name des Slides
  - Screenshot für das Slide erstellen
    - Speichert gleichzeitig die Startposition und das lookAt-Target der Camera 
- Scene
  - Zeigt die verfügbaren Optionen des SlideContainers an
  - Vorschaubild hochladen
- Files
  - Anzeige aller verfügbaren GLTF Modelle in der Bibliothek
  - Hochladen eines GLTF Models in die Bibliothek
  
## Installation & Entwicklung

Klonen oder downloaden Sie das Projekt auf Ihren Rechner und installieren Sie die Dependencies mit den nachstehenden Befehlen.

**Installation** `npm install`

**Development** `npm run serve`

**Component Dokumentation** `npm run doc`

**Build** `npm run build`

### Entry Points
**2D**

`src > main.js`

**3D**

`src > Components > Editor > XRScene.vue`
