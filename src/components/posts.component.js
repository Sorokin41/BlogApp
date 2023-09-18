import { renderPost } from '../../templates/post.template'
import { Component } from '../core/component'
import { apiService } from '../services/api.service'
import { TransformService } from '../services/transform.service'

export class PostsComponent extends Component {
    constructor(id, {loader}) {
        super(id)
        this.loader = loader
    }

    async onShow() {
        this.loader.show()
        const fbData = await apiService.fetchPosts()
        const posts = TransformService.fbObjectToArray(fbData)
        const html = posts.map(post => renderPost(post, {withButton: true}))
        this.loader.hide()

        this.$el.insertAdjacentHTML('afterbegin', html.join(' '))
    }

    init() {
        this.$el.addEventListener('click', buttonHandler.bind(this))
    }

    onHide() {
        this.$el.innerHTML = ''
    }
}

function buttonHandler(event) {
    const $el = event.target
    const id = $el.dataset.id
    const title = $el.dataset.title
    if (id) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || []
        const candidate = favorites.find(post => post.id === id)

        if (candidate){
            $el.classList.add('button-primary')
            $el.classList.remove('button-danger')
            $el.textContent = 'Сохранить'
            favorites = favorites.filter(post => post.id !== id)
        } else {
            $el.classList.remove('button-primary')
            $el.classList.add('button-danger')
            $el.textContent = 'Удалить'
            favorites.push({id, title})
        }

        localStorage.setItem('favorites', JSON.stringify(favorites))
    }

}