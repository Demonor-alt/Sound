<template>
    <div id="app">
      <header>
        <button @click="start">开始 +10 经验</button>
      </header>
      <main>
        <section>
          <h2>元音</h2>
          <div class="vowel-list">
            <div v-for="(vowel, index) in vowels" :key="index" class="vowel-item">
              <span>{{ vowel.symbol }}</span>
              <span>{{ vowel.word }}</span>
            </div>
          </div>
        </section>
        <section>
          <h2>辅音</h2>
          <div class="consonant-list">
            <div v-for="(consonant, index) in consonants" :key="index" class="consonant-item">
              <span>{{ consonant.symbol }}</span>
              <span>{{ consonant.word }}</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const vowels = ref([
    { symbol: 'ɑ', word: 'hot' },
    { symbol: 'æ', word: 'cat' },
    { symbol: 'ʌ', word: 'but' },
    { symbol: 'ɛ', word: 'bed' },
    { symbol: 'eɪ', word: 'say' },
    { symbol: 'ə', word: 'bird' },
    { symbol: 'ɪ', word: 'ship' },
    { symbol: 'iː', word: 'sheep' },
    { symbol: 'ə', word: 'about' },
    { symbol: 'oʊ', word: 'boat' },
    { symbol: 'ʊ', word: 'foot' },
    { symbol: 'uː', word: 'food' },
    { symbol: 'aʊ', word: 'cow' },
    { symbol: 'aɪ', word: 'time' },
    { symbol: 'ɔɪ', word: 'boy' }
  ]);
  
  const consonants = ref([
    { symbol: 'b', word: 'book' },
    { symbol: 'tʃ', word: 'chair' },
    { symbol: 'd', word: 'day' },
    { symbol: 'f', word: 'fish' },
    { symbol: 'g', word: 'go' },
    { symbol: 'h', word: 'home' },
    { symbol: 'dʒ', word: 'job' },
    { symbol: 'k', word: 'key' },
    { symbol: 'l', word: 'lion' },
    { symbol: 'm', word: 'moon' },
    { symbol: 'n', word: 'nose' },
    { symbol: 'ŋ', word: 'sing' },
    { symbol: 'p', word: 'pig' },
    { symbol: 'j', word: 'red' },
    { symbol: 's', word: 'see' },
    { symbol: 'ʒ', word: 'measure' },
    { symbol: 'ʃ', word: 'shoe' },
    { symbol: 't', word: 'time' },
    { symbol: 'ð', word: 'then' },
    { symbol: 'θ', word: 'think' },
    { symbol: 'v', word: 'very' },
    { symbol: 'w', word: 'water' },
    { symbol: 'j', word: 'you' },
    { symbol: 'z', word: 'zoo' }
  ]);
  
  const start = () => {
    alert('开始学习，获得10经验值！');
  };
  </script>
  
  <style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
  
  header {
    margin-bottom: 20px;
  }
  
  .vowel-list, .consonant-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .vowel-item, .consonant-item {
    margin: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 150px;
    
  }
  </style>