<template>
    <el-affix :offset="100">
        <div class="top">
            <el-popover placement="bottom" :width="200" trigger="hover">
                <template #reference>
                    <div
                        :class="{ america: language === 'english', china: language === 'mandarin' || language === 'cantonese' }">
                    </div>
                </template>
                <div class="content">
                    <div style="color: #afafaf;">我的课程</div>
                    <div class="myclass">
                        <div
                            :class="{ america: language === 'english', china: language === 'mandarin' || language === 'cantonese' }">
                        </div>
                        {{ lan }}
                    </div>
                    <div class="myclass" @click="toStep1">
                        <div class="addplus"></div>
                        添加新的课程
                    </div>
                </div>
            </el-popover>
            <div v-if="languageData.isSparked === false" class="topitems">
                <div class="spark"></div>
                <div style="color: #afafaf;">{{ languageData.sparkCount }}</div>
            </div>
            <div v-else class="topitems">
                <div class="sparkfill"></div>
                <div style="color: #ff9f17;">{{ languageData.sparkCount }}</div>
            </div>
            <el-popover placement="bottom" :width="250" trigger="hover">
                <template #reference>
                    <div class="topitems">
                        <div class="gem"></div>
                        <div style="color: #1cb0f6;">{{ languageData.gemCount }}</div>
                    </div>
                </template>
                <div class="gem-content">
                    <div class="box"></div>
                    <div class="gem-item">
                        <div style="font-size: 25px;">宝石</div>
                        你有{{ languageData.gemCount }}颗宝石
                        <el-button link style="color: #1cb0f6;">访问宝石小店</el-button>
                    </div>
                </div>
            </el-popover>
            <el-popover placement="bottom" :width="200" trigger="hover">
                <template #reference>
                    <div class="topitems">
                        <div class="heart"></div>
                        <div style="color: #ff4b4b;">{{ languageData.heartCount }}</div>
                    </div>
                </template>
                <h1>红心</h1>
                <div v-if="languageData.heartCount===5">
                    <div class="hearts">
                        <div v-for="index in languageData.heartCount" class="heart"></div>
                    </div>
                    <h2>红心满满</h2>
                    继续加油吧！
                </div>
                <div v-else>
                    <div class="hearts">
                        <div v-for="index in languageData.heartCount" class="heart"></div>
                        <div v-for="index in 5-languageData.heartCount" class="heartplus"></div>
                    </div>
                    <h2>红心满满</h2>
                    你还有红心呢！接着练吧！
                </div>
            </el-popover>
        </div>
    </el-affix>
</template>
<script setup>
import { ref } from 'vue';
import { useLanguageStore } from '@/stores/language';
const { language, showLanguage } = useLanguageStore();
const lan = ref(showLanguage());
const languageData = ref({
    isSparked: false,
    sparkCount: 0,
    gemCount: 500,
    heartCount: 5,
});
import { useRouter } from 'vue-router'
const router = useRouter()
const toStep1 = () => {
    router.push('/teach/step1');
}
</script>
<style>

.top {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 400px;

    .topitems {
        display: flex;
        flex-direction: row;
        gap: 10px;
        align-items: center;
    }
}

.america {
    width: 30px;
    height: 30px;
    background: url('../../assets/pictures/america.png') no-repeat center / contain;
    border-radius: 10px;
}

.china {
    width: 30px;
    height: 30px;
    background: url('../../assets/pictures/chinese.png') no-repeat center / contain;
    border-radius: 10px;
}

.spark {
    width: 30px;
    height: 30px;
    background: url('../../assets/icons/spark.svg') no-repeat center / contain;
}

.sparkfill {
    width: 30px;
    height: 30px;
    background: url('../../assets/icons/sparkfill.svg') no-repeat center / contain;
}

.gem {
    width: 30px;
    height: 30px;
    background: url('../../assets/icons/gem.svg') no-repeat center / contain;
}

.heart {
    width: 30px;
    height: 30px;
    background: url('../../assets/icons/heart.svg') no-repeat center / contain;
}
.heartplus {
    width: 30px;
    height: 30px;
    background: url('../../assets/icons/heartplus.svg') no-repeat center / contain;
}
.box {
    width: 60px;
    height: 60px;
    background: url('../../assets/icons/box.svg') no-repeat center / contain;
}

.addplus {
    width: 30px;
    height: 30px;
    background: url('../../assets/icons/addplus.svg') no-repeat center / contain;
}

.content {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .myclass {
        display: flex;
        flex-direction: row;
        gap: 10px;
        align-items: center;
        padding: 10px;
        border-radius: 6px;
        border: #e5e5e5 2px solid;
        cursor: pointer;
    }
}
.gem-content{
    display: flex;
    flex-direction: row;
    gap: 25px;
    align-items: center;
    .gem-item{
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
}
.hearts{
    display: flex;
    flex-direction: row;
}
</style>