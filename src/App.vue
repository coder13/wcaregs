<template>
  <div id="app" class="section">
    <div class="container">
      <h1 class="title is-1">WCA-Regs</h1>
      <h5 class="subtitle is-5">Version: {{regulations.version}}</h5>

      <br/>
      <h3 class="title is-3">Labels: </h3>

      <ul>
        <li v-for="(label,index) in regulations.labels" :key="index">
          <span class="tag">{{label.type}}</span> {{label.description}}
        </li>
      </ul>
    </div>

    <div class="container">
      <div class="article" v-for="(article,index) in regulations.articles" :key="index">
        <div :id="article.id">
          <div :id="article.name2">
            <h2 class="title article-title" :id="`article-${article.id}-${article.name}`">
              <a :href="`article-${article.id}-${article.name}` | link">Article {{article.id}}</a>: {{article.description.split(': ')[1]}}
            </h2>
          </div>
        </div>

        <ul>
          <div :class="'indent-' + regulation.level"  v-for="(regulation,regIndex) in article.regulations" :key="regIndex">
            <li v-if="regulation.description" :id="regulation.id">
              <a :href="regulation.id | link">{{regulation.id}}</a>) {{regulation.description}}</span>
            </li>
            <li :id="regulation.id + guideline.pluses" v-for="(guideline,regIndex) in regulation.guidelines" :key="regIndex">
              <a :href="(guideline.id + guideline.pluses) | link">{{guideline.id + guideline.pluses}}</a>) <span class="tag">{{guideline.label}}</span> {{guideline.description}}</span>
            </li>
          </div>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import regulations from './assets/regulationsAndGuidelines.json'

export default {
  name: 'app',
  data () {
    return {
      regulations
    }
  },
  filters: {
    link (value) {
      return '#' + value
    }
  }
}
</script>

<style>

body {
  font-weight: 300;
}

.tag {
  font-weight: 500;
}

.article {
  margin-top: 20px;
}

.article-title {
  margin-top: 20px;
  margin-bottom: 20px;
}

ul li, ol li {
  line-height: 175%;
}

ul {
  margin-left: 2em;
}

.indent-1 {
  margin-left: 0em;
}

.indent-2 {
  margin-left: 2em;
}

.indent-3 {
  margin-left: 4em;
}

.indent-4 {
  margin-left: 8em;
}

:target {
  background-color: yellow;
}

:target > .tag {
  background-color: yellow;
}
</style>
