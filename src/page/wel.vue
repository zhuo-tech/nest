<template>
  <div>
    <basic-container>
      <avue-data-box :option="box"></avue-data-box>
    </basic-container>
    <basic-container>
      <avue-data-icons :option="icons"></avue-data-icons>
    </basic-container>
    <basic-container>
      <avue-data-progress :option="progress"></avue-data-progress>
    </basic-container>
    <basic-container>
      <avue-article :props="articleProps" :data="article"></avue-article>
    </basic-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Wel',
  data() {
    return {
      box: {
        span: 6,
        data: [
          {
            click: function(item) {
              alert(JSON.stringify(item))
            },
            title: '错误日志',
            count: 12332,
            icon: 'el-icon-warning',
            color: 'rgb(49, 180, 141)',
            target: '_blank'
          },
          {
            click: function(item) {
              alert(JSON.stringify(item))
            },
            title: '数据展示',
            count: 33,
            icon: 'el-icon-view',
            color: 'rgb(56, 161, 242)',
            target: '_blank'
          },
          {
            click: function(item) {
              alert(JSON.stringify(item))
            },
            title: '权限管理',
            count: 2223,
            icon: 'el-icon-setting',
            color: 'rgb(117, 56, 199)',
            target: '_blank'
          },
          {
            click: function(item) {
              alert(JSON.stringify(item))
            },
            title: '权限管理',
            count: 2223,
            icon: 'el-icon-setting',
            color: 'rgb(117, 56, 199)',
            target: '_blank'
          }
        ]
      },
      icons: {
        span: 4,
        data: [
          {
            click: function(item) {
              alert(JSON.stringify(item))
            },
            title: '今日注册',
            count: 12678,
            decimals: 2,
            icon: 'el-icon-tickets',
            target: '_blank'
          },
          {
            click: function(item) {
              alert(JSON.stringify(item))
            },
            title: '今日登录',
            count: 22139,
            icon: 'el-icon-success',
            target: '_blank'
          },
          {
            click: function(item) {
              alert(JSON.stringify(item))
            },
            title: '今日订阅',
            count: 35623,
            icon: 'el-icon-info',
            target: '_blank'
          },
          {
            click: function(item) {
              alert(JSON.stringify(item))
            },
            title: '今日评论',
            count: 16826,
            icon: 'el-icon-message',
            target: '_blank'
          },
          {
            click: function(item) {
              alert(JSON.stringify(item))
            },
            title: '今日评论',
            count: 16826,
            icon: 'el-icon-message',
            target: '_blank'
          },
          {
            click: function(item) {
              alert(JSON.stringify(item))
            },
            title: '今日评论',
            count: 16826,
            icon: 'el-icon-message',
            target: '_blank'
          }
        ]
      },
      progress: {
        span: 6,
        data: [
          {
            click: function(item) {
              alert(JSON.stringify(item))
            },
            title: '转化率（日同比 28%）',
            color: 'rgb(178, 159, 255)',
            count: 32,
            target: '_blank'
          },
          {
            click: function(item) {
              alert(JSON.stringify(item))
            },
            title: '签到率（日同比 11%）',
            color: 'rgb(230, 71, 88)',
            count: 32,
            target: '_blank'
          },
          {
            click: function(item) {
              alert(JSON.stringify(item))
            },
            title: 'CPU使用率',
            color: 'rgb(27, 201, 142)',
            count: 56,
            target: '_blank'
          },
          {
            click: function(item) {
              alert(JSON.stringify(item))
            },
            title: '使用人数',
            color: 'red',
            count: 56,
            target: '_blank'
          }
        ]
      },
      article: {
        title: '永远的蝴蝶',
        meta: '陈启佑（台湾）',
        lead: '《永远的蝴蝶》是台湾著名作家陈启佑先生的一篇小小说。这是一篇散文化的微型小说，其语言具有较强的抒情色彩，立意含蓄隽永 。作品情节很简单，写的是一个凄美的爱情故事。在一个雨天，“我”的恋人樱子自愿帮“我”到马路对面去寄信。随着一阵拔尖的刹车声，樱子年轻的生命消逝了。',
        body: `<p>那时候刚好下着雨，柏油路面湿冷冷的，还闪烁着青、黄、红颜色的灯火。我们就在骑楼下躲雨，看绿色的邮筒孤独地站在街的对面。我白色风衣的大口袋里有一封要寄给南部的母亲的信。樱子说她可以撑伞过去帮我寄信。我默默点头。</p>
                <p>“谁叫我们只带来一把小伞哪。”她微笑着说，一面撑起伞，准备过马路帮我寄信。从她伞骨渗下来的小雨点，溅在我的眼镜玻璃上。</p>
                <p>随着一阵拔尖的煞车声，樱子的一生轻轻地飞了起来。缓缓地，飘落在湿冷的街面上，好像一只夜晚的蝴蝶。</p>
                <p>虽然是春天，好像已是秋深了。</p>
                <p>她只是过马路去帮我寄信。这简单的行动，却要叫我终身难忘了。我缓缓睁开眼，茫然站在骑楼下，眼里裹着滚烫的泪水。世上所有的车子都停了下来，人潮涌向马路中央。没有人知道那躺在街面的，就是我的，蝴蝶。这时她只离我五公尺，竟是那么遥远。更大的雨点溅在我的眼镜上，溅到我的生命里来。</p>
                <p>为什么呢？只带一把雨伞？</p>
                <p>然而我又看到樱子穿着白色的风衣，撑着伞，静静地过马路了。她是要帮我寄信的。那，那是一封写给南部母亲的信。我茫然站在骑楼下，我又看到永远的樱子走到街心。其实雨下得并不大，却是一生一世中最大的一场雨。而那封信是这样写的，年轻的樱子知不知道呢？</p>
                <blockquote>
                  <p>妈：我打算在下个月和樱子结婚。</p>
                </blockquote>`
      },
      articleProps: {
        title: 'title',
        meta: 'meta',
        lead: 'lead',
        body: 'body'
      }
    }
  },
  computed: {
    ...mapGetters(['website'])
  },
  methods: {}
}
</script>

<style scoped="scoped" lang="scss">
.el-collapse-item__header {
  display: block !important;
}

.wel-contailer {
  position: relative;
}

.banner-text {
  position: relative;
  padding: 0 20px;
  font-size: 20px;
  text-align: center;
  color: #333;
}

.banner-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.8;
  display: none;
}

.actor {
  height: 250px;
  overflow: hidden;
  font-size: 18px;
  color: #333;
}

.actor:after {
  content: '';
  width: 3px;
  height: 25px;
  vertical-align: -5px;
  margin-left: 5px;
  background-color: #333;
  display: inline-block;
  animation: blink 0.4s infinite alternate;
}

.typeing:after {
  animation: none;
}

@keyframes blink {
  to {
    opacity: 0;
  }
}
</style>
