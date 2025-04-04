<script setup>
import { ref, onMounted } from 'vue'
const props = defineProps({
    rotatedStatus: {
        type: Boolean,
        default: true
    }
})

const AutoScrollRef = ref()

onMounted(() => {
    let oldScrollHeight = 0
    setInterval(() => {
        try {
            if (AutoScrollRef.value.scrollHeight !== oldScrollHeight) {
                AutoScrollRef.value.scrollTop = AutoScrollRef.value.scrollHeight
                oldScrollHeight = AutoScrollRef.value.scrollHeight
            }
        } catch (e) { console.log() }
    }, 200)
})


</script>
<template>

    <div ref="AutoScrollRef" class="whiteboard" :class="{
        'rotate-board': props.rotatedStatus,
        'fullscreen-board': !props.rotatedStatus
    }">
        <slot></slot>
    </div>

</template>
<style scoped>
.whiteboard {
    float: right;
    background-color: #f2f2f7c5;
    border-radius: 10px;
    box-shadow: 0 0 18px rgb(125, 218, 249);
    margin: 10px;
    padding: 20px;
    overflow: auto;
}

.rotate-board {
    z-index: 101;
    transform: rotate3d(0.1, 1, 0, 30deg) rotate(-1deg);
    width: 60%;
    height: 80%;
    animation: toRotateStatus 1.5s 1 alternate, breath 5s infinite alternate;
}

.fullscreen-board {
    z-index: 103;
    width: 100%;
    height: 100%;
    transform: unset;
    margin-top: 80px;
    margin-x: 40px;
    margin-bottom: 40px;
    animation: toFullScreenStatus 1.5s 1 alternate;
}

@keyframes toFullScreenStatus {
    0% {
        width: 60%;
        height: 80%;
        transform: rotate3d(0.1, 1, 0, 30deg) rotate(-1deg);
    }

    100% {
        width: 100%;
        height: 100%;
        transform: rotate3d(0.1, 1, 0, 0deg) rotate(0deg);
    }
}

@keyframes toRotateStatus {
    0% {
        width: 100%;
        height: 100%;
        transform: rotate3d(0.1, 1, 0, 0deg) rotate(0deg);
    }

    100% {
        width: 60%;
        height: 80%;
        transform: rotate3d(0.1, 1, 0, 30deg) rotate(-1deg);
    }
}

@keyframes breath {
    0% {
        transform: rotate3d(0.1, 1, 0, 10deg) rotate(-1deg) translateY(0px);
    }

    50% {
        transform: rotate3d(0.1, 1, 0, 17.5deg) rotate(-1deg) translateY(-5px);
    }

    100% {
        transform: rotate3d(0.1, 1, 0, 25deg) rotate(-1deg) translateY(0px);
    }
}
</style>