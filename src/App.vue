<template>
  <div id="app">
    <nav class="navbar is-inline-flex-touch" role="navigation">
      <div class="navbar-brand is-hidden-mobile">
        <router-link class="navbar-item" style="display: block; line-height: 1em" to="/">
          <h1 style="margin: 0px">WCA-Regs</h1>
          <span style="font-size: .65em;">Version: {{this.$root.$data.regulations.version}}</span>
        </router-link>
      </div>
      <div class="navbar-item stretch">
        <div class="control stretch">
          <input class="input" v-model="query" @keyup.13="updateRoute" type="text"/>
        </div>
      </div>
    </nav>

    <div id="page">
      <keep-alive include="Main" exclude="Search">
        <router-view/>
      </keep-alive>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'

export default {
  name: 'app',
  data () {
    return {
      query: this.$route.query.q
    }
  },
  methods: {
    updateRoute () {
      if (this.query) {
        this.$router.push({ name: 'search', query: { q: this.query } })
      } else {
        this.$router.push({ name: 'home' })
      }
    }
  }
}
</script>

<style>

body {
  font-weight: 300;
  font-size: 14px;
}

body {
  /* Never get smaller than this */
}

@media (min-width:600px) {
  body {
    font-size: 16px;
  }
}

@media (min-width:800px) {
  body {
    font-size: .75em;
  }
}

@media (min-width:1000px) {
  body {
    /* Never get larger than this */
    font-size: 1em;
  }
}

#page {
  margin: 1em;
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

ul regulation.li, ol regulation.li {
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

:target > div {
  background-color: yellow;
}

:target > div > .tag {
  background-color: rgb(240, 240, 0);
}
</style>
