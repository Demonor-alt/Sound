<template>
    <svg t="1727508508255" class="icon rotatingIcon" viewBox="0 0 1024 1024" version="1.1"
        xmlns="http://www.w3.org/2000/svg" p-id="5483" :width="props.size" :height="props.size">
        <path
            d="M512.930909 92.858182a420.072727 420.072727 0 1 0 0 840.145454 420.072727 420.072727 0 0 0 0-840.145454z m0 114.036363a306.036364 306.036364 0 1 1 0 612.072728 306.036364 306.036364 0 0 1 0-612.072728z"
            fill="#1296db" fill-opacity=".25" p-id="5484"></path>
        <path
            d="M512.930909 92.858182v114.036363a306.036364 306.036364 0 1 0 234.449455 502.737455l7.726545-9.541818 90.158546 69.818182a420.072727 420.072727 0 1 1-344.715637-676.864l12.381091-0.186182z"
            fill="#1296db" fill-opacity=".85" p-id="5485"></path>
    </svg>
</template>
<script setup>
const props = defineProps({
    size: {
        type: String,
        default: '20px'
    }
})

</script>