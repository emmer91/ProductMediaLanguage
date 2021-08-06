const { Component, Context, Utils, State } = Shopware;
const { isEmpty } = Utils.types;

Component.override('sw-product-detail-base', {
    computed: {
        productMediaLanguageRepository() {
            return this.repositoryFactory.create('product_media_language');
        },
    },

    methods: {
        addMedia(media) {
            if (this.isExistingMedia(media)) {
                return Promise.reject(media);
            }

            const newMedia = this.productMediaRepository.create(Context.api);
            newMedia.mediaId = media.id;
            newMedia.media = {
                url: media.url,
                id: media.id
            };

            const productMediaLanguageId = Utils.createId();

            const productMediaLanguage = this.productMediaLanguageRepository.create(Context.api, productMediaLanguageId);
            productMediaLanguage.id = productMediaLanguageId;
            productMediaLanguage.productMediaId = newMedia.id;
            productMediaLanguage.languageId = State.get('context').api.languageId;
            productMediaLanguage.cover = false;

            if (isEmpty(this.product.media)) {
                productMediaLanguage.cover = true;
                this.setMediaAsCover(newMedia);
            }

            newMedia.extensions.productMediaLanguage = productMediaLanguage;

            this.product.media.add(newMedia);

            return Promise.resolve();
        },
    }
});
