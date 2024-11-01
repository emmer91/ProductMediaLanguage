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

            this.addProductMediaLanguageToProductMedia(newMedia);

            if (isEmpty(this.product.media)) {
                this.setMediaAsCover(newMedia);
            }

            this.product.media.add(newMedia);

            return Promise.resolve();
        },

        mediaRemoveInheritanceFunction(newValue) {
            newValue.forEach(({ id, mediaId, position, extensions }) => {
                const media = this.productMediaRepository.create(Context.api);
                Object.assign(media, { mediaId, position, productId: this.product.id });

                this.addProductMediaLanguageToProductMedia(media);

                media.extensions.productMediaLanguage.cover = false;
                if (extensions.productMediaLanguage.cover) {
                    this.product.coverId = media.id;
                    media.extensions.productMediaLanguage.cover = true;
                }

                this.product.media.push(media);
            });

            this.$refs.productMediaInheritance.forceInheritanceRemove = true;

            return this.product.media;
        },

        addProductMediaLanguageToProductMedia(productMedia) {
            if (productMedia.extensions.productMediaLanguage && productMedia.extensions.productMediaLanguage.id) {
                return;
            }

            const productMediaLanguageId = Utils.createId();

            const productMediaLanguage = this.productMediaLanguageRepository.create(Context, productMediaLanguageId);
            productMediaLanguage.id = productMediaLanguageId;
            productMediaLanguage.productMediaId = productMedia.id;
            productMediaLanguage.languageId = State.get('context').api.languageId;
            productMediaLanguage.cover = this.product.media.length <= 0;

            productMedia.extensions.productMediaLanguage = productMediaLanguage;
        },
    }
});
