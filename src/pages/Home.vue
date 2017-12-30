<template>
<div>
  <div class="container">
    <h5 class="title is-5">Labels: </h5>

    <table class="table" style="width: 100%">
      <tr v-for="(label,index) in regulations.labels" :key="index">
        <td>{{label.type}}</td><td>{{label.description}}</td>
      </tr>
    </table>
  </div>

  <div class="container">
    <div class="article" v-for="(article,index) in regulations.articles" :key="index">
      <span class="anchor" :id="article.id"/>
      <span class="anchor" :id="article.name2"/>
      <span class="anchor" :id="`article-${article.id}-${article.name}`"/>
      <h2 class="title article-title">
        <a :href="`article-${article.id}-${article.name}` | link">Article {{article.id}}</a>: {{article.description.split(': ')[1]}}
      </h2>

      <ul>
        <div v-for="(regulation,regIndex) in article.regulations" :key="regIndex" :class="'indent-' + regulation.level">
          <li v-if="regulation.description">
            <span class="anchor" :id="regulation.id"/>
            <a class="anchor" :href="regulation.id | link">{{regulation.id}}</a>) {{regulation.description}}</span>
          </li>
          <li v-for="(guideline,regIndex) in regulation.guidelines" :key="regIndex">
            <span class="anchor" :id="regulation.id + guideline.pluses"/>
            <a :href="(guideline.id + guideline.pluses) | link">{{guideline.id + guideline.pluses}}</a>) <span class="tag">{{guideline.label}}</span> {{guideline.description}}</span>
          </li>
        </div>
      </ul>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'Main',
  data () {
    return {
      regulations: this.$root.$data.regulations
    }
  }
}
</script>

<style>
</style>
