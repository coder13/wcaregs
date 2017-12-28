<template>
  <div id="app" class="section">
    <div class="container content">
      <h1>WCA-Regs</h1>
      <h5>Version: {{regulations.version}}</h5>

      <h3>Labels: </h3>

      <ul>
        <li v-for="(label,index) in regulations.labels" :key="index">
          {{label.type}}
        </li>
      </ul>
    </div>

    <div class="container">
      <div class="article" v-for="(article,index) in regulations.articles" :key="index">
        <div :id="article.id">
          <div :id="article.name2">
            <h2 class="title" :id="`article-${article.id}-${article.name}`">
              <a :href="`article-${article.id}-${article.name}` | link">Article {{article.id}}</a>: {{article.description.split(': ')[1]}}
            </h2>
          </div>
        </div>

        <ul>
          <div v-for="(regulation,regIndex) in article.regulations" :key="regIndex">
            <li>
              <a :id="regulation.id" :class="'indent-' + regulation.level" :href="regulation.id | link">{{regulation.id}}</a>) {{regulation.description}}</span>
            </li>
            <li v-for="(guideline,regIndex) in regulation.guidelines" :key="regIndex">
              <a :id="regulation.id + guideline.pluses" :class="'indent-' + guideline.level" :href="(guideline.id + guideline.pluses) | link">{{guideline.id + guideline.pluses}}</a>) <span class="tag">{{guideline.label}}</span> {{guideline.description}}</span>
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
.article {
  margin-top: 4em;
}

li {
  margin-top: .25em;
}

.indent-1 {
  margin-left: 2em;
}

.indent-2 {
  margin-left: 6em;
}

.indent-3 {
  margin-left: 10em;
}

.indent-4 {
  margin-left: 14em;
}
</style>
