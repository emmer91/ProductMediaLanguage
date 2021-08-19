import template from './sw-prodict-variants-media-upload.html.twig';
const { Component, Context, State, Utils } = Shopware;

Component.override('sw-product-variants-media-upload', {
    template,
    computed: {
        cover() {
            if (!this.product) {
                return null;
            }

            return this.product.media.find(productMedia => {
                    return this.isCover(productMedia);
                }
            );
        },

        productMediaLanguageRepository() {
            return this.repositoryFactory.create('product_media_language');
        },
    },
    methods: {
        isCover(productMedia) {
            return productMedia.extensions.productMediaLanguage ? productMedia.extensions.productMediaLanguage.cover : false;
        },

        markMediaAsCover(productMedia) {
            this.$super('markMediaAsCover', productMedia);

            this.product.media.forEach((productMediaElement) => {
                this.setProductMediaLanguageCoverValue(productMediaElement, false);
            })

            this.setProductMediaLanguageCoverValue(productMedia, true);
        },

        removeMedia(productMedia) {
            this.$super('removeMedia', productMedia);

            if (productMedia.extensions.productMediaLanguage.cover) {
                const cover = this.product.media.first();
                cover.extensions.productMediaLanguage.cover = true;
            }
        },

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

        // Need to complete overwrite because targetId is media id and product media will not be returned, just added to the collection
        onUploadMediaSuccessful({ targetId }) {
            if (this.isReplacedMedia(targetId)) {
                return;
            }

            const newMedia = this.productMediaRepository.create(Context.api);
            newMedia.productId = this.source.id;
            newMedia.mediaId = targetId;

            this.addProductMediaLanguageToProductMedia(newMedia);

            if (isEmpty(this.source.media)) {
                newMedia.position = 0;
                this.source.coverId = newMedia.id;
            } else {
                newMedia.position = this.source.media.length;
            }

            this.source.media.add(newMedia);
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

        setProductMediaLanguageCoverValue(productMedia, value) {
            if (productMedia.extensions.productMediaLanguage) {
                productMedia.extensions.productMediaLanguage.cover = value;
            }
        },
    },
});
