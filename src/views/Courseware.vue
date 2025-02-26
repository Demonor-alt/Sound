<el-popover placement="bottom" :width="200" trigger="hover">
  <template #reference>
      <div class="america">
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