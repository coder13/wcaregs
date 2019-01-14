<template>
<div id="home">
  <div class="container">
    <table class="table" style="width: 100%;">
      <tr v-for="(label,index) in regulations.labels" :key="index">
        <td>{{label.type}}</td><td>{{label.description}}</td>
      </tr>
    </table>

    <h2 class='title'><a class="anchor" id="contents" href="./#contents">Contents</a></h2>

    <ul>
      <li v-for="(article,index) in regulations.articles" :key="index">
        Article {{article.id}}: <a :href="`article-${article.id}-${article.name}` | link">{{article.description.split(': ')[1]}}</a>
      </li>
    </ul>

    <hr>

    <div class="article" v-for="(article,index) in regulations.articles" :key="index">
      <span class="anchor" :id="article.id"/>
      <span class="anchor" :id="article.name2"/>
      <span class="anchor" :id="`article-${article.id}-${article.name}`"/>
      <h2 class="title article-title">
        <a :href="`article-${article.id}-${article.name}` | link">Article {{article.id}}</a>: {{article.description.split(': ')[1]}}
      </h2>

      <ul>
        <div v-for="(regulation,regIndex) in article.regulations" :key="regIndex" :class="'indent-' + regulation.level">
          <li v-if="regulation.description" class='regulation' :id="regulation.id">
            <span class="anchor" :id="regulation.id"/>
            <div><a class="anchor" :href="regulation.id | link">{{regulation.id}}</a>)
              <template v-for="desc in regulation.description">
                <a v-if="!!desc.href" :href="`#${desc.href.split(':')[2]}`">{{desc.content}}</a>
                <span v-else>{{desc.content}}</span>
              </template>
            </div>
          </li>
          <li v-for="(guideline,regIndex) in regulation.guidelines" :key="regIndex" class='guideline' :id="regulation.id + guideline.pluses">
            <span class="anchor" :id="regulation.id + guideline.pluses"/>
            <div><a :href="(guideline.id + guideline.pluses) | link">{{guideline.id + guideline.pluses}}</a>) <span class="tag">{{guideline.label}}</span>
              <template v-for="desc in guideline.description">
                <a v-if="!!desc.href" :href="`#${desc.href.split(':')[2]}`">{{desc.content}}</a>
                <span v-else>{{desc.content}}</span>
              </template></div>
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
