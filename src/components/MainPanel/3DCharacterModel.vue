<script setup>
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { onMounted, toRef, watch, ref } from "vue";
import EasyMorph from "../../utils/EasyMorph";

const emits = defineEmits([
    "listModelanimations",
])


const props = defineProps({
    modelPath: {
        type: String,
        default: "/model.glb"
    },
    is3DModelLoad: {
        type: Boolean,
        default: false
    },
    changeAnimation: {
        type: String,
        default: "idle"
    },
    isSideBarHide: {
        type: Boolean,
        default: false
    },
    ModelPresetsSelect: {
        type: String,
        default: ""
    }
})

// const model_path = "https://cdn.eurekac.cn/s.glb"
const model_path = ref("/" + props.ModelPresetsSelect)
watch(toRef(props, "ModelPresetsSelect"), async (newVal) => {
    model_path.value = "/" + newVal
    document.getElementById("container").innerHTML = ""
    await init()
})
const asleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const init = async () => {

    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    let renderer = new THREE.WebGLRenderer();

    const dracoloader = new DRACOLoader();
    dracoloader.setDecoderPath('/draco/');

    let loader = new GLTFLoader();
    loader.setDRACOLoader(dracoloader);
    let light = new THREE.DirectionalLight(0xffffff, 1);
    let clock = new THREE.Clock()
    let model = null;
    let mixer = null;


    let fileMorphs = [];
    let fileAnimations = null;
    let idleAnim = null;




    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    document.getElementById("container").appendChild(renderer.domElement);

    camera.position.z = 1;
    camera.position.y = 1;
    camera.position.x = 1;


    const ambientLight = new THREE.AmbientLight(0xffffff, 1); // 白光，强度为1
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight('rgb(253,253,253)', 5);
    dirLight.position.set(10, 10, 5); // 根据需要自行调整位置
    scene.add(dirLight);
    loader.load(model_path.value, async function (gltf) {
        model = gltf.scene;
        scene.add(model);
        console.log(model)
        window.model = model;
        mixer = new THREE.AnimationMixer(model)
        fileAnimations = gltf.animations;
        idleAnim = THREE.AnimationClip.findByName(fileAnimations, 'idle');
        emits("listModelanimations", fileAnimations.map((item) => item.name))
        let idle = mixer.clipAction(idleAnim);
        idle.play();

        fileMorphs = new EasyMorph()
        fileMorphs.setModel(model)
        window.fileMorphs = fileMorphs
    });

    watch(toRef(props, "changeAnimation"), (newVal) => {
        console.log("Animation Changed")
        console.log(newVal)
        if (model) {
            mixer.stopAllAction();
            let anim = THREE.AnimationClip.findByName(fileAnimations, newVal);
            console.log(anim)
            let action = mixer.clipAction(anim);
            action.setLoop(THREE.LoopOnce);
            action.clampWhenFinished = true;
            action.play();
            setTimeout(() => {
                action.stop();
                let idle = mixer.clipAction(idleAnim);
                idle.setLoop(THREE.LoopRepeat);
                idle.play();
            }, anim.duration * 1000);
        }
    });

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        let width = window.innerWidth
        let height = window.innerHeight
        let canvasPixelWidth = 0.7 * canvas.width / window.devicePixelRatio;
        let canvasPixelHeight = 0.7 * canvas.height / window.devicePixelRatio;
        const needResize =
            canvasPixelWidth !== width || canvasPixelHeight !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }


    function update() {
        if (mixer) {
            mixer.update(clock.getDelta());
        }
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        renderer.render(scene, camera);
        requestAnimationFrame(update);
    }
    update();
    while (1) {
        if (model) {
            model.position.y = -9.29
            model.position.x = -4.18
            model.rotation.y = 0.72
            camera.position.z = 12.3
            break;
        }
        await asleep(300);
    }
}

onMounted(async () => {
    await init();
})

</script>
<template>
    <div id="container" :style="{
        'right':  '15%',
    }">
    </div>
</template>

<style scoped>
#container {
    position: absolute;
    z-index: 102;
}
</style>