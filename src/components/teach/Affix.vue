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
                        {{ currentLanguage }}
                    </div>
                    <div class="myclass" @click="toStep1">
                        <div class="switch"></div>
                        切换新的课程
                    </div>
                </div>
            </el-popover>
            <div v-if="isSparked === false" class="topitems">
                <div class="spark"></div>
                <div style="color: #afafaf;">{{ sparkCount }}</div>
            </div>
            <div v-else class="topitems">
                <div class="sparkfill"></div>
                <div style="color: #ff9f17;">{{ sparkCount }}</div>
            </div>
            <el-popover placement="bottom" :width="250" trigger="hover">
                <template #reference>
                    <div class="topitems">
                        <div class="gem"></div>
                        <div style="color: #1cb0f6;">{{ gemCount }}</div>
                    </div>
                </template>
                <div class="gem-content">
                    <div class="box"></div>
                    <div class="gem-item">
                        <div style="font-size: 25px;">宝石</div>
                        你有{{ gemCount }}颗宝石
                        <el-button link style="color: #1cb0f6;" @click="toShop">访问宝石小店</el-button>
                    </div>
                </div>
            </el-popover>
        </div>
        <div class="task">
            <h3>每日特别任务</h3>
            <div class="task-content">
                <div class="power"></div>
                <div class="experience">
                    <div style="margin-bottom: 10px;display: flex;justify-content: center;">获取{{ ((isSparked ? 0 :
        1) + sparkCount)
        * 10 }}经验</div>
                    <el-progress :text-inside="true" :stroke-width="24" :percentage="percentage" color="black" />
                </div>
                <div class="boxplus" v-if="percentage === 100 && !isBoxOpen && !isRewarded"
                    :class="{ 'boxplus-jump': percentage === 100 }" @click="dialogVisible = true"></div>
                <div class="boxopen" v-else-if="percentage === 100 || isRewarded"></div>
                <div class="boxplus" v-else></div>
                <el-dialog v-model="dialogVisible" width="30%" align-center :show-close="false">
                    <div style="font-size: large;color: black;font-weight: 600;margin-bottom: 10px;display: flex;flex-direction: row;gap: 5px;align-items: center">
                        恭喜获得10 <div class="gem"></div>
                    </div>
                    <template #footer>
                        <span class="dialog-footer">
                            <el-button color="black" @click="openBox();dialogVisible = false;">
                                确认
                            </el-button>
                        </span>
                    </template>
                </el-dialog>
            </div>
        </div>
        <div class="actions">
            <div class="btn-practice" @click="toTeach">发音练习</div>
            <el-divider direction="vertical" style="height: 25px;" />
            <div class="btn-practice" @click="toShop">宝石小店</div>
        </div>
    </el-affix>
</template>
<script setup>
import { ref } from 'vue';
import { useLanguageStore } from '@/stores/language';
import { storeToRefs } from 'pinia';
const languageStore = useLanguageStore()
const { language, sparkCount, gemCount, isSparked, currentExperience,isRewarded } = storeToRefs(languageStore);
const { showLanguage } = useLanguageStore();
const currentLanguage = ref(showLanguage());
const percentage = ref(currentExperience);
import { useRouter } from 'vue-router';
const router = useRouter()
const toStep1 = () => {
    router.push('/teach/step1');
}
const toShop = () => {
    router.push('/teach/shop');
}
const toTeach = () => {
    router.push('/teach');
};
const dialogVisible = ref(false);
const isBoxOpen = ref(false);
const openBox = () => {
    if (percentage.value === 100) {
        isBoxOpen.value = true;
    }
    isRewarded.value = true;
    gemCount.value += 10;
    console.log(gemCount.value);
};
</script>
<style scoped>
.top {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 250px;
    margin-left: 80px;

    .topitems {
        display: flex;
        flex-direction: row;
        gap: 10px;
        align-items: center;
    }
}

.america {
    cursor: pointer;
    width: 30px;
    height: 30px;
    background: url('../../assets/pictures/america.png') no-repeat center / contain;
    border-radius: 10px;
}

.china {
    cursor: pointer;
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
    cursor: pointer;
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

.boxplus {
    width: 50px;
    height: 50px;
    background: url('../../assets/icons/box.svg') no-repeat center / contain;
}

.boxopen {
    width: 50px;
    height: 50px;
    background: url('../../assets/icons/boxopen.svg') no-repeat center / contain;
}

.switch {
    width: 30px;
    height: 30px;
    background: url('../../assets/icons/switch.svg') no-repeat center / contain;
}

.power {
    width: 50px;
    height: 50px;
    background: url('../../assets/icons/power.svg') no-repeat center / contain;
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

.gem-content {
    display: flex;
    flex-direction: row;
    gap: 25px;
    align-items: center;

    .gem-item {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
}

.heart-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.hearts {
    display: flex;
    flex-direction: row;
}

.task {
    margin-top: 30px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px 20px 30px 20px;
    border: #e5e5e5 2px solid;
    border-radius: 10px;
}

.task-content {
    display: flex;
    flex-direction: row;
    align-items: end;
}

.experience {
    width: 80%;
    margin: 0 10px;
}

.actions {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
.btn-practice{
    color: black;
    cursor: pointer;
}
.btn-practice:hover{
    color: #afafaf;
}
</style>

<style scoped>
/* 定义动画关键帧 */
@keyframes boxplus-jump {
    0% {
        transform: rotate(10deg);
    }

    50% {
        transform: rotate(-10deg);

    }

    100% {
        transform: rotate(10deg);

    }
}

/* 应用动画到 boxplus 元素 */
.boxplus-jump {
    animation: boxplus-jump 1s infinite;
    cursor: pointer;
}
</style>