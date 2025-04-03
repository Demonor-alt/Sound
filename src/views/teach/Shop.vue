<template>
    <div class="mbody">
        <el-row>
            <el-col :span="14">
                <div class="store-container">
                    <h1>道具</h1>
                    <div class="props-list">
                        <el-row class="prop-card" v-for="item in items" :key="item.name">
                            <el-col :span="4">
                                <div :class="item.imageClass"></div>
                            </el-col>
                            <el-col :span="13">
                                <div style="font-size: larger;font-weight: 600 ;">{{ item.name }}</div>
                                <p>{{ item.descripe }}</p>
                            </el-col>
                            <el-col :span="6" class="price">
                                <div @click="gemCount < item.price?null:showDialog(item)"
                                    :class="{ 'price-item': true, 'unaffordable': gemCount < item.price }">
                                    价格：<div :class="{ 'gem': true, 'graygem': gemCount < item.price }"></div>
                                    {{ item.price }}
                                </div>
                                <!-- 使用动态组件绑定当前点击的 item -->
                                <el-dialog v-model="currentDialogVisible" width="30%" align-center :show-close="false">
                                    <div style="font-size: large;color: black;font-weight: 600;margin-bottom: 10px;">
                                        购买道具
                                    </div>
                                    <div class="dialog">
                                        是否要购买{{ currentItem.name }}
                                    </div>
                                    <template #footer>
                                        <span class="dialog-footer">
                                            <el-button color="#f4f4f5" plain
                                                style="color: black; border: #e4e4e7 1px solid; "
                                                @click="currentDialogVisible = false">取消</el-button>
                                            <el-button color="black" @click="currentDialogVisible = false; reduceGemCount(currentItem.price);">
                                                确认
                                            </el-button>
                                        </span>
                                    </template>
                                </el-dialog>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </el-col>
            <el-col :span="9">
                <div style="margin-left: 100px;">
                    <Myaffix />
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import Myaffix from '@/components/teach/Affix.vue';
import { useLanguageStore } from '@/stores/language';
import { storeToRefs } from 'pinia';
const languageStore = useLanguageStore()
const { gemCount } = storeToRefs(languageStore);
const items = ref([
    { name: '连胜激冻', descripe: '即使一整天不练习，你的连胜天数也能保持不变。', price: 200, imageClass: 'freeze' },
    { name: '翻倍或全赔', descripe: '保持 7 天连胜，你投入的 50 颗宝石筹码就能赢回双倍！', price: 50, imageClass: 'wager' },
    { name: '记忆面包', descripe: '24小时内自动收集你的错题，为你智能生成专属错题集，助力高效复习！', price: 80, imageClass: 'memory-bread' }
])
const currentDialogVisible = ref(false);
const currentItem = ref(null);

const showDialog = (item) => {
    currentItem.value = item;
    currentDialogVisible.value = true;
}

const reduceGemCount = (price) => {
    gemCount.value -= price;
}
</script>

<style scoped>
.mbody {
    margin: 0 10%;
}

.store-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
    margin-bottom: 30px;
}

h3 {
    color: #2c3e50;
    margin: 10px 0;
}

.card {
    background: #f9f9f9;
    border-radius: 8px;
    padding: 15px;
    margin: 15px 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.prop-card {
    background: white;
    border-radius: 8px;
    padding: 20px;
    margin: 15px 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: row;
    align-items: center;
}

.props-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.free-experience hr {
    border: 1px solid #eee;
    margin: 15px 0;
}

.freeze {
    width: 90px;
    height: 90px;
    background: url('../../assets/pictures/freeze.png') no-repeat center / contain;
    border-radius: 10px;
}

.wager {
    width: 90px;
    height: 90px;
    background: url('../../assets/pictures/wager.png') no-repeat center / contain;
    border-radius: 10px;
}

.memory-bread {
    width: 80px;
    height: 80px;
    margin: 10px;
    background: url('../../assets/icons/correction.svg') no-repeat center / contain;
    border-radius: 10px;
}

.gem {
    width: 20px;
    height: 20px;
    background: url('../../assets/icons/gem.svg') no-repeat center / contain;
}

.graygem {
    width: 20px;
    height: 20px;
    background: url('../../assets/icons/graygem.svg') no-repeat center / contain;
}

.price {
    display: flex;
    align-items: end;
}

.price-item {
    margin: 10px;
    padding: 10px;
    border: 2px solid #e5e5e5;
    border-radius: 15px;
    width: 150px;
    display: flex;
    border-bottom-width: 4px;
    transition: border-bottom-width 0.1s;
    cursor: pointer;
    justify-content: center;
    align-items: center;
}

.price-item:hover {
    background-color: #f0f0f0;
}

.price-item:active {
    border-bottom-width: 2px;
}

.unaffordable {
    background-color: #f0f0f0;
    border-bottom-width: 2px;
    color: #c5c5c5;
}
</style>