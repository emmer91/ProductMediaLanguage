const { Component, State, Utils, Context } = Shopware;
const { Criteria } = Shopware.Data;

Component.override('sw-product-variants-overview', {
    computed: {
        productMediaLanguageRepository() {
            return this.repositoryFactory.create('product_media_language');
        },
    },

    methods: {
        buildSearchQuery(criteria) {
            const searchCriteria = this.$super('buildSearchQuery', criteria);

            searchCriteria.addAssociation('media.productMediaLanguage');
            searchCriteria.getAssociation('media').addFilter(Criteria.equals('productMediaLanguage.languageId', State.get('context').api.languageId ));

            return searchCriteria
        },

        onMediaInheritanceRemove(variant, isInlineEdit) {
            if (!isInlineEdit) {
                return;
            }

            variant.forceMediaInheritanceRemove = true;
            this.product.media.forEach(({ id, mediaId, position, extensions }) => {
                const media = this.productMediaRepository.create(Context.api);
                Object.assign(media, { mediaId, position, productId: this.product.id });

                this.addProductMediaLanguageToProductMedia(media);

                media.extensions.productMediaLanguage.cover = false;
                if (extensions.productMediaLanguage.cover) {
                    variant.coverId = media.id;
                    media.extensions.productMediaLanguage.cover = true;
                }

                variant.media.push(media);
            });
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
    },
});
