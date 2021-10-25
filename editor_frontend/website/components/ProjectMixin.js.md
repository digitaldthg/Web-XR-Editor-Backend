# ProjectMixin.js

In eine Component eingesetzt hält es die Informationen zum aktuellen Slide sowie zum aktuellen SlideContainer

## Methods

<!-- @vuese:ProjectMixin.js:methods:start -->
|Method|Description|Parameters|
|---|---|---|
|GetProjekt|Holt das aktuelle Projekt anhand der route.params.id und setzt es als aktuelles Projekt im Store("SetProjekt") <br><br>=> returned Promise<Projekt>|-|
|AddSlide|Fügt ein Slide zum slideContainer hinzu <br><br>=> returned ein Promise<slideContainer>|slideContainer|
|AddContainer|Fügt einen SlideContainer zum Projekt hinzu <br><br>=> returned ein Promise<Projekt>|-|
|AddElement|Fügt dem aktuellen Slide ein Element hinzu. <br><br>1. Lädt das Element zum CMS hoch(POST) <br>2. Erstellt ein SlideElement mit dem neuen Element und lädt das zum CMS(POST) <br>3. Fügt das SlideElement zum Slide hinzu (POST) <br>4. Aktualisiert das Projekt <br><br>=> returned Promise<Projekt>|Element|
|DeleteSlideContainer|Löscht den SlideContainer anhand der ID <br><br>1. Löscht alle SlideElements im SlideContainer <br>2. Löscht alle enhaltenen Slides <br>3. Löscht den SlideContainer mit ID <br>=> returned Promise<Projekt>|{number} containerID|

<!-- @vuese:ProjectMixin.js:methods:end -->


## MixIns

<!-- @vuese:ProjectMixin.js:mixIns:start -->
|MixIn|
|---|
|IOMixin|

<!-- @vuese:ProjectMixin.js:mixIns:end -->


