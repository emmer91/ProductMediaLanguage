import template from './sw-product-media-form.html.twig';
const { Component, Context, State, Utils } = Shopware;

Component.override('sw-product-media-form', {
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

        currentCoverID() {
            const productMediaCover = this.productMedia.find(productMedia => {
                return this.isCover(productMedia);

            });

            return productMediaCover.id;
        },
    },

    methods: {
        buildProductMedia(mediaId) {
            this.isLoading = true;

            const productMedia = this.$super('buildProductMedia', mediaId);

            this.addProductMediaLanguageToProductMedia(productMedia);

            this.isLoading = false;

            return productMedia;
        },

        createMediaAssociation(targetId) {
            const productMedia = this.$super('createMediaAssociation', targetId);

            this.addProductMediaLanguageToProductMedia(productMedia);

            return productMedia;
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

        createPlaceholderMedia(mediaItems) {
            const placeholder = this.$super('createPlaceholderMedia', mediaItems);

            placeholder.extensions = {
                productMediaLanguage: {
                    cover: mediaItems.length === 0
                }
            };

            return placeholder;
        },

        removeCover() {
            this.$super('removeCover');

            this.product.media.forEach((productMedia) => {
                if (productMedia.extensions.productMediaLanguage) {
                    this.setProductMediaLanguageCoverValue(productMedia, false);
                }
            })
        },

        isCover(productMedia) {
            return productMedia.extensions.productMediaLanguage ? productMedia.extensions.productMediaLanguage.cover : false;
        },

        removeFile(productMedia) {
            this.$super('removeFile', productMedia);

            if(productMedia.extensions.productMediaLanguage ? productMedia.extensions.productMediaLanguage.cover : false) {
                if (this.product.media.first()) {
                    this.setProductMediaLanguageCoverValue(this.product.media.first(), true);
                }
            }
        },

        markMediaAsCover(productMedia) {
            this.$super('markMediaAsCover', productMedia);

            this.product.media.forEach((productMediaElement) => {
                this.setProductMediaLanguageCoverValue(productMediaElement, false);
            })

            this.setProductMediaLanguageCoverValue(productMedia, true);
        },

        onDropMedia(dragData) {
            this.$super('onDropMedia', dragData)

            if (this.product.media.length !== 1) {
                return;
            }

            const productMedia = this.product.media.first();
            this.setProductMediaLanguageCoverValue(productMedia, true);
        },

        setProductMediaLanguageCoverValue(productMedia, value) {
            if (productMedia.extensions.productMediaLanguage) {
                productMedia.extensions.productMediaLanguage.cover = value;
            }
        },
    },
});
