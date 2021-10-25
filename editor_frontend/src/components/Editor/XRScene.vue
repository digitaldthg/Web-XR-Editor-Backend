<template>
  <main class="slide-scene-preview">
    <template v-if="progress != null">
      <div class="progress-bar" v-if="progress.progress != 1">
        <div
          class="progress-bar-inner"
          :style="'width:' + progress.progress * 100 + '%'"
        ></div>
      </div>
    </template>
    <div id="xr-scene"></div>
  </main>
</template>
<script>
import webXRScene from "../../webxr_scene/src/index";
import * as THREE from "three";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import config from "../../../../main.config";
import DataBehaviourMixin from "../../Controller/DataBehaviourMixin";
import Utils from "../../Common/Utils";
import ThreeMeshUI from "three-mesh-ui";

import textJSON from "./TextTextures/Roboto-msdf.json";
import * as textPNG from "@/Components/Editor/TextTextures/Roboto-msdf.png";

import { EventManager } from "../../Events/EventManager.js";
import ProjectMixin from "../../Controller/ProjectMixin";

//@group 3D Scene
export default {
  name: "XRScene",
  mixins: [DataBehaviourMixin, ProjectMixin],
  data() {
    return {
      attachedModels: {},
      progress: null,
      selected: null,
      library: {},
    };
  },
  mounted() {
    //Create Primitive first
    this.CreatePrimitives();

    this.InitWebXR();

    EventManager.$on("Select", this.HandleModelSelection.bind(this));
    EventManager.$on("Deselect", this.HandleModelDeselection.bind(this));

    this.$store.state.xr.Events.addEventListener(
      "OnAnimationLoop",
      this.AnimationLoop.bind(this)
    );
  },
  watch: {
    "$store.state.currentProjekt": function() {
      if (this.slide === null || typeof this.slide == "undefined") {
        return;
      }

      this.DetatchCurrentSlideModels(this.$store.state.slideIndex);
      this.AppendCurrentSlideModels();
    },
    "$store.state.slideIndex": function(newValue, oldValue) {
      this.DetatchCurrentSlideModels(oldValue);
      this.AppendCurrentSlideModels();

      this.MoveCamera(
        this.slideContainer.Slides[oldValue],
        this.slideContainer.Slides[newValue]
      );
    },
    "$store.state.slideContainerIndex": function(newValue, oldValue) {
      this.DetatchCurrentSlideModels(this.$store.state.slideIndex);
      this.AppendCurrentSlideModels();
    },
    "$route.params.slideContainerIndex": function(newValue) {
      this.$store.commit("SetSlideContainerIndex", newValue);
    },
    "$route.params.slideIndex": function(newValue) {
      this.$store.commit("SetSlideIndex", newValue);
    },
  },
  methods: {
    // @vuese
    // Setzt die Camera auf die Position des neue Slides
    // @arg slide
    MoveCamera(oldSlide, newSlide) {
      if (newSlide.CameraPosition != null) {
        this.$store.state.xr.Controls.SetPosition(
          newSlide.CameraPosition.x,
          newSlide.CameraPosition.y,
          newSlide.CameraPosition.z
        );
      }
      if (newSlide.CameraTarget != null) {
        this.$store.state.xr.Controls.SetTarget(
          newSlide.CameraTarget.x,
          newSlide.CameraTarget.y,
          newSlide.CameraTarget.z
        );
      }
    },
    // @vuese
    //Definiert alle Primitive Typen
    CreatePrimitives() {
      this.library.Cube = {
        scene: new THREE.Mesh(
          new THREE.BoxGeometry(1, 1, 1),
          new THREE.MeshStandardMaterial()
        ),
      };
      this.library.Cone = {
        scene: new THREE.Mesh(
          new THREE.ConeGeometry(0.5, 1, 32),
          new THREE.MeshStandardMaterial()
        ),
      };
      this.library.Cylinder = {
        scene: new THREE.Mesh(
          new THREE.CylinderGeometry(0.5, 0.5, 1, 32),
          new THREE.MeshStandardMaterial()
        ),
      };
      this.library.Sphere = {
        scene: new THREE.Mesh(
          new THREE.SphereGeometry(0.5, 16, 16),
          new THREE.MeshStandardMaterial()
        ),
      };
      this.library.Torus = {
        scene: new THREE.Mesh(
          new THREE.TorusGeometry(0.314, 0.15, 12, 32),
          new THREE.MeshStandardMaterial()
        ),
      };
      this.library.Plane = {
        scene: new THREE.Mesh(
          new THREE.PlaneGeometry(1, 1),
          new THREE.MeshStandardMaterial({ side: THREE.DoubleSide })
        ),
      };
    },
    // @vuese
    // Kreiiert ein neues 3D - TextElement
    // @arg FontSettings
    // @return ThreeMeshUI.Block
    CreateText(element) {
      var {
        Width,
        Height,
        Padding,
        BackgroundOpacity,
        BackgroundColor,
        Alignment,
        Justification,
        LineHeight,
        FontSize,
        Content,
        Color,
      } = element.element.FontSettings;

      const container = new ThreeMeshUI.Block(
        Object.assign({
          height: Height != null ? Height : 2.5,
          width: Width != null ? Width : 4,
          padding: Padding != null ? Padding : 0.2,
          backgroundOpacity: BackgroundOpacity != null ? BackgroundOpacity : 1,
          backgroundColor:
            BackgroundColor != null
              ? new THREE.Color(BackgroundColor)
              : new THREE.Color(0xaaaaaa),
          alignContent: Alignment != null ? Alignment : "left",
          justifyContent: Justification != null ? Justification : "center",
          interLine: LineHeight != null ? LineHeight * 0.01 : 0.01,
          side: THREE.DoubleSide,
          fontSize: FontSize != null ? FontSize * 0.5 : 0.5,
        })
      );

      const text = new ThreeMeshUI.Text({
        content: Content != null ? Content : "Default Text",
        fontColor:
          Color != null ? new THREE.Color(Color) : new THREE.Color(0x000000),
        fontFamily: textJSON,
        fontTexture: textPNG,
        side: THREE.DoubleSide,
      });

      container.add(text);

      return container;
    },
    // @vuese
    // Selektiert ein slideElement
    // @arg slideElement
    HandleModelSelection(slideElement) {
      this.Select(
        Utils.GetSceneReference(this.$store.state.xr.Scene, slideElement)
      );
    },
    // Deselektiert ein slideElement
    // @arg slideElement
    HandleModelDeselection(slideElement) {
      this.Deselect(
        Utils.GetSceneReference(this.$store.state.xr.Scene, slideElement)
      );
    },
    // @vuese
    // Erstellt eine neue webxrscene und fügt die minimalen Editor 3D Scenen Elemente hinzu
    // Camera, Renderer, Ambientlight, Directionallight, Grid
    InitWebXR() {
      var xr = new webXRScene("xr-scene");
      xr.Renderer.instance.setClearColor(0xffffff, 1);

      var { CameraPosition, CameraTarget } = this.slide;
      if (CameraPosition != null) {
        xr.Controls.SetPosition(
          CameraPosition.x,
          CameraPosition.y,
          CameraPosition.z
        );
      }

      if (CameraTarget != null) {
        xr.Controls.SetTarget(CameraTarget.x, CameraTarget.y, CameraTarget.z);
      }

      var AmbientLight = new THREE.AmbientLight(0xeeeeee, 1);
      xr.Scene.add(AmbientLight);

      var DirectionalLight = new THREE.DirectionalLight(0xffffff, 1);
      xr.Scene.add(DirectionalLight);

      const size = 100;
      const divisions = 10;

      const gridHelper = new THREE.GridHelper(size, divisions);
      xr.Scene.add(gridHelper);
      xr.transformControls = new TransformControls(
        xr.Camera.instance,
        xr.Renderer.instance.domElement
      );

      xr.transformControls.addEventListener("dragging-changed", (event) => {
        xr.Controls.enabled = !event.value;

        this.ChangeObjectByGizmo();
      });

      xr.Scene.add(xr.transformControls);

      this.$store.commit("ApplyXR", xr);
      this.AppendCurrentSlideModels();
    },
    LoadProgress(progress) {
      this.progress = progress;
    },

    // @vuese
    // Ändert die funktionsweise des Gizmos von Translate,Rotate,Scale
    ChangeObjectByGizmo() {
      var mode = this.$store.state.xr.transformControls.getMode();

      var slideElements = this.selected.userData.slideElements;
      switch (mode) {
        case "translate":
          // @vuese 
          // Ändert die Position eines Object3D
          EventManager.$emit("ChangeTransform3D", {
            type: "position",
            object: this.selected,
          });

          var slideElements = this.selected.userData.slideElements;
          this.SetValue({
            object: slideElements,
            path: "slideElements.Offset",
            value: this.selected.position,
          });

          break;
        case "scale":
          EventManager.$emit("ChangeTransform3D", {
            type: "scale",
            object: this.selected,
          });
          this.SetValue({
            object: slideElements,
            path: "slideElements.Scale",
            value: this.selected.scale,
          });

          break;
        case "rotate":
          EventManager.$emit("ChangeTransform3D", {
            type: "quaternion",
            object: this.selected,
          });

          this.SetValue({
            object: slideElements,
            path: "slideElements.Rotation",
            value: this.selected.quaternion,
          });
          break;
      }
    },

    // @vuese
    // Fügt ein einzelnes 3D Object der Scene hinzu 
    
    AddSingleModelToScene(item, libraryItem, copyItem = true) {
      var slideElements = this.slide.SlideElements;
      var sElement = slideElements.find((element) => element === item);

      if (
        !this.attachedModels.hasOwnProperty(this.$store.state.containerIndex)
      ) {
        this.attachedModels[this.$store.state.containerIndex] = {};
      }

      if (
        !this.attachedModels[this.$store.state.containerIndex].hasOwnProperty(
          this.$store.state.slideIndex
        )
      ) {
        this.attachedModels[this.$store.state.containerIndex][
          this.$store.state.slideIndex
        ] = new THREE.Scene();
        this.$store.state.xr.Scene.add(
          this.attachedModels[this.$store.state.containerIndex][
            this.$store.state.slideIndex
          ]
        );
      }

      var libItem = libraryItem;
      //make a copy of the Object
      if (copyItem) {
        libItem.scene = libItem.scene.clone();
      }

      if (!libItem.scene.hasOwnProperty("userData")) {
        libItem.scene.userData = {};
      }

      libItem.scene.userData.slideElements = item;

      //Tmp
      libItem.scene.traverse((child) => {
        if (!child) {
          return;
        }
        if (child.type != "Mesh") {
          return;
        }

        child.isUI = true;
        child.setState = this.SetStateOfObject;
        this.$store.state.xr.Controls.ActiveObjects.push(child);
      });
      var pos = new THREE.Vector3(0, 0, 0);
      if (item.Offset != null) {
        pos.x = item.Offset.x != null ? item.Offset.x : pos.x;
        pos.y = item.Offset.y != null ? item.Offset.y : pos.y;
        pos.z = item.Offset.z != null ? item.Offset.z : pos.z;
      }
      libItem.scene.position.set(pos.x, pos.y, pos.z);

      //Set Scale
      var scale = new THREE.Vector3(1, 1, 1);
      if (item.Offset != null) {
        scale.x = item.Scale.x != null ? item.Scale.x : scale.x;
        scale.y = item.Scale.y != null ? item.Scale.y : scale.y;
        scale.z = item.Scale.z != null ? item.Scale.z : scale.z;
      }
      libItem.scene.scale.set(scale.x, scale.y, scale.z);

      //Set Rotation
      var quaternion = new THREE.Quaternion(0, 0, 0, 1);

      if (item.Rotation != null) {
        quaternion.x = item.Rotation.x != null ? item.Rotation.x : quaternion.x;
        quaternion.y = item.Rotation.y != null ? item.Rotation.y : quaternion.y;
        quaternion.z = item.Rotation.z != null ? item.Rotation.z : quaternion.z;
        quaternion.w = item.Rotation.w != null ? item.Rotation.w : quaternion.w;
      }

      libItem.scene.quaternion.set(
        quaternion.x,
        quaternion.y,
        quaternion.z,
        quaternion.w
      );

      if (item.element.Type.Type == "Primitive") {
        libItem.scene.material = libItem.scene.material.clone();

        var color = new THREE.Color(0xff0000);
        color =
          item.element.Color != null
            ? new THREE.Color(item.element.Color)
            : color;
        libItem.scene.material.color = color;
      }

      this.attachedModels[this.$store.state.containerIndex][
        this.$store.state.slideIndex
      ].add(libItem.scene);
    },

    // @vuese
    // Lädt alle Slide Modelle und fügt sie zum Slide hinzu
    AppendCurrentSlideModels() {
      var slideElements = this.slide.SlideElements;

      var otherElements = slideElements.filter(
        (el) => el.element.Type.Type != "Object3D"
      );

      var primitiveElements = slideElements.filter(
        (el) => el.element.Type.Type === "Primitive"
      );

      var textElements = slideElements.filter(
        (el) => el.element.Type.Type === "Text"
      );

      primitiveElements.map((element) => {
        this.AddSingleModelToScene(
          element,
          this.library[element.element.Primitive.PrimitiveType]
        );
      });

      textElements.map((element) => {
        const container = this.CreateText(element);

        this.library.Text = { scene: container };

        this.AddSingleModelToScene(element, { scene: container }, false);
      });

      var elementsToLoad = slideElements
        .filter((el) => {
          return el.element.Type.Type === "Object3D";
        })
        .map((slideElement) => {
          if (typeof slideElement.element.Asset == "undefined") {
            return null;
          }

          var path = config.CMS_BASE_URL + slideElement.element.Asset.url;
          var name = slideElement.Name;

          return {
            url: path,
            name: name,
          };
        })
        .filter((el) => el != null);

      elementsToLoad = elementsToLoad.reduce((acc, current) => {
        const x = acc.find((item) => item.name === current.name);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);

      this.$store.state.xr.Loader.loadStack({
        stack: elementsToLoad,
        progress: this.LoadProgress,
      }).then((library) => {
        this.library = Object.assign(this.library, library);

        slideElements.map((slideElement) => {
          if (typeof library[slideElement.Name] === "undefined") {
            return;
          }

          this.AddSingleModelToScene(slideElement, library[slideElement.Name]);
        });

        this.$store.state.xr.Events.addEventListener(
          "ui-mouse-down",
          this.Select
        );
        this.$store.state.xr.Events.addEventListener("ui-hovered", this.Hover);
      });
    },
    // @vuese
    // Platzhalterfunktion: 
    SetStateOfObject(state) {
      console.log("SetStateOfObject", state);
    },
    // @vuese
    // Löscht ein SlideModel vom aktuellen Slide
    // @arg index:number des Slides
    DetatchCurrentSlideModels(oldSlideIndex) {
      if (this.selected != null) {
        this.Deselect(this.selected);
      }

      const itemsToDelete = {};

      if (
        this.attachedModels.hasOwnProperty(this.$store.state.containerIndex)
      ) {
        if (
          this.attachedModels[this.$store.state.containerIndex].hasOwnProperty(
            oldSlideIndex
          )
        ) {
          this.$store.state.xr.Scene.remove(
            this.attachedModels[this.$store.state.containerIndex][oldSlideIndex]
          );
          delete this.attachedModels[this.$store.state.containerIndex][
            oldSlideIndex
          ];
          this.$store.state.xr.Controls.ActiveObjects = [];
        }
      }
    },

    // @vuese
    // Selektiert ein Objekt, falls dieses Objekt ein child Element von einem größeren Object ist wird statt des childs der Parent ausgewählt
    // @arg 3DObject welches selektiert werden soll
    Select(mesh) {
      if (mesh.parent === null) {
        console.warn("Selected mesh is not present in scene any more!");
        return;
      }

      var parent = Utils.GetParent(mesh);
      if (parent === this.selected) {
        return;
      }

      if (this.selected != null) {
        EventManager.$emit("3DDeselect", this.selected);
        this.selected.userData.selected = false;
        this.$store.state.xr.transformControls.detach(this.selected);

        this.$store.commit("SetSelection", null);
      }

      this.selected = parent;
      this.selected.userData.selected = true;
      this.$store.state.xr.transformControls.attach(this.selected);

      EventManager.$emit("3DSelect", this.selected);
      this.$store.commit("SetSelection", this.selected);
    },
    // @vuese
    // Deselektiert ein Object
    // @arg Object3D
    Deselect(mesh) {
      if (mesh != this.selected) {
        return;
      }

      this.selected.userData.selected = false;
      this.$store.state.xr.transformControls.detach(this.selected);
      EventManager.$emit("3DDeselect", this.selected);

      this.selected = null;
    },
    Hover(mesh) {},
    // @vuese
    // Wird jeden OnAnimationFrame ausgeführt
    // @arg THREE.Clock
    AnimationLoop(clock) {
      ThreeMeshUI.update();
    },
  },
};
</script>

<style lang="scss" scoped>
.progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  background: #9e9e9e;
  height: 5px;
}

.progress-bar-inner {
  height: 100%;
  position: relative;
  background: $primaryColor;
}
#xr-scene {
  pointer-events: all;
  width: 100%;
  height: 100%;
}
</style>
