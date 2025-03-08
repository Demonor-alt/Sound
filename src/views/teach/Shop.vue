<template>
    <div class="mbody">
        <el-row>
            <el-col :span="14">
                <div class="store-container">
                    <h1>道具</h1>
                    <div class="props-list">
                        <div class="prop-card">
                            <div class="freeze"></div>
                            <div class="prop-header">
                                <h3>连胜激冻</h3>
                                <span class="equip-status">已装备 {{ equipped }}/2</span>
                            </div>
                            <p>即使一整天不练习，你的连胜天数也能保持不变。</p>
                            <div class="price-section">
                                <span class="price">价格：{{ items[0].price }}</span>
                                <button class="buy-btn">购买</button>
                            </div>
                        </div>

                        <div class="prop-card">
                            <div class="wager"></div>
                            <h3>翻倍或全赔</h3>
                            <p>保持 7 天连胜，你投入的 50 颗宝石筹码就能赢回双倍！</p>
                            <div class="price-section">
                                <span class="price">价格：{{ items[1].price }}</span>
                                <button class="buy-btn">购买</button>
                            </div>
                        </div>
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

const equipped = ref(0)
const items = ref([
    { name: '连胜激冻', price: 200 },
    { name: '翻倍或全赔', price: 50 }
])
</script>

<style scoped>
.mbody {
    margin: 1% 10%;
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
}

.prop-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.equip-status {
    color: #7f8c8d;
    font-size: 0.9em;
}

.price-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;
}

.price {
    color: #27ae60;
    font-weight: bold;
}

.buy-btn {
    background: #3498db;
    color: white;
    border: none;
    padding: 8px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;
}

.buy-btn:hover {
    background: #2980b9;
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
</style>