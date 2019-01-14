<template>
<div>
  <div class="container">
    <ul>
      <li v-for="(regulation,index) in (this.$route.query.q ? regulationsToShow : regulations)" :key="index">
        <span class="anchor" :id="regulation.item.id"/>
        <router-link :to="'/#' + regulation.item.id">{{regulation.item.id}}</router-link>) <span v-if="regulation.item.label" class="tag">{{regulation.item.label}}</span> <span v-html="regulation.highlight || regulation.item.description"/>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
import flatten from 'lodash.flatten'
import {compare as almphanumbericCompare} from 'alphanumeric-sort'
import Fuse from 'fuse.js'

const options = {
  threshold: 0.20,
  includeMatches: true,
  distance: 1000,
  includeScore: true,
  minMatchCharLength: 1,
  findAllMatches: true,
  keys: [{
    name: 'id',
    weight: 0.25
  }, {
    name: 'description',
    weight: 1
  }]
}

// https://github.com/brunocechet/Fuse.js-with-highlight/blob/master/index.js
const highlight = function (resultItem) {
  return resultItem.matches.map((matchItem) => {
    let text = resultItem.item[matchItem.key]
    if (matchItem.key === 'id') {
      return resultItem
    }

    let result = []
    let matches = [].concat(matchItem.indices).filter(i => (i[1] - i[0]) > 3)
    let pair = matches.shift()

    for (let i = 0; i < text.length; i++) {
      let char = text.charAt(i)
      if (pair && i === pair[0]) {
        result.push('<span class="highlight">')
      }

      result.push(char)

      if (pair && i === pair[1]) {
        result.push('</span>')
        pair = matches.shift()
      }
    }

    resultItem.highlight = result.join('')

    if (resultItem.children && resultItem.children.length > 0) {
      resultItem.children = resultItem.children.map((child) => highlight(child))
    }

    return resultItem
  })
}

// const joinDesc = c => c ? c.map(i => i.content).join('') : ''

export default {
  name: 'Search',
  props: ['q'],
  data () {
    let regs = flatten(this.$root.$data.regulations.articles.map(a => {
      let article = { type: 'regulation', id: a.id, name: a.name, name2: a.name2, description: a.description }

      return flatten(a.regulations.map(r => [{
        article,
        id: r.id,
        level: r.level,
        description: r.description ? r.description.map(i => i.content).join('') : ''
      }].concat(r.guidelines.map(g => ({
        article,
        type: 'guideline',
        label: g.label,
        id: g.id + g.pluses,
        level: g.level,
        description: g.description ? g.description.map(i => i.content).join('') : ''
      })))
      ))
    }))

    return {
      regulations: regs
    }
  },
  computed: {
    regulationsToShow () {
      let fuse = new Fuse(this.regulations, options)

      let results = fuse.search(this.$route.query.q).map(i => highlight(i)[0])
      results = results.sort((a, b) => {
        return almphanumbericCompare(a.item.id, b.item.id)
      })

      console.log(results)

      return results
    }
  }
}
</script>

<style>

.highlight {
  background: yellow
}

</style>
