# XRScene

## Events

<!-- @vuese:XRScene:events:start -->
|Event Name|Description|Parameters|
|---|---|---|
|ChangeTransform3D|Ändert die Position eines Object3D|-|
|3DDeselect|-|-|
|3DSelect|-|-|

<!-- @vuese:XRScene:events:end -->


## Methods

<!-- @vuese:XRScene:methods:start -->
|Method|Description|Parameters|
|---|---|---|
|MoveCamera|Setzt die Camera auf die Position des neue Slides|slide|
|CreatePrimitives|Definiert alle Primitive Typen|-|
|CreateText|Kreiiert ein neues 3D - TextElement|FontSettings|
|HandleModelSelection|Selektiert ein slideElement|slideElement|
|InitWebXR|Erstellt eine neue webxrscene und fügt die minimalen Editor 3D Scenen Elemente hinzu Camera, Renderer, Ambientlight, Directionallight, Grid|-|
|ChangeObjectByGizmo|Ändert die funktionsweise des Gizmos von Translate,Rotate,Scale|-|
|AddSingleModelToScene|Fügt ein einzelnes 3D Object der Scene hinzu|-|
|AppendCurrentSlideModels|Lädt alle Slide Modelle und fügt sie zum Slide hinzu|-|
|SetStateOfObject|Platzhalterfunktion:|-|
|DetatchCurrentSlideModels|Löscht ein SlideModel vom aktuellen Slide|index:number des Slides|
|Select|Selektiert ein Objekt, falls dieses Objekt ein child Element von einem größeren Object ist wird statt des childs der Parent ausgewählt|3DObject welches selektiert werden soll|
|Deselect|Deselektiert ein Object|Object3D|
|AnimationLoop|Wird jeden OnAnimationFrame ausgeführt|THREE.Clock|

<!-- @vuese:XRScene:methods:end -->


## MixIns

<!-- @vuese:XRScene:mixIns:start -->
|MixIn|
|---|
|DataBehaviourMixin|
|ProjectMixin|

<!-- @vuese:XRScene:mixIns:end -->


