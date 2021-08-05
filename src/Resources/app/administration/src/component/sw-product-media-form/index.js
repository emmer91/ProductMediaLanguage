// TODO: cover handling in admin
import template from './sw-product-media-form.html.twig';
const {Component} = Shopware;
const {Criteria} = Shopware.Data;
Component.override('sw-product-media-form', {
    template,
    computed: {
        cover() {
            if (!this.product) {
                return null;
            }

            return this.product.media.find(media => {
                    return media.extensions.productMediaLanguage ? media.extensions.productMediaLanguage.cover : false;
                }
            );
        },

        productMediaRepository() {
            return this.repositoryFactory.create('product_media');
        },

        productMediaLanguageRepository() {
            return this.repositoryFactory.create('product_media_language');
        },

        productMedia() {
            if (!this.product) {
                return [];
            }
            return this.product.media;
        },

        productMediaStore() {
            return this.product.getAssociation('media');
        },

        currentCoverID() {
            const coverMediaItem = this.productMedia.find(coverMedium => {
                return coverMedium.extensions.productMediaLanguage ? coverMedium.extensions.productMediaLanguage.cover : false;

            });

            return coverMediaItem.id;
        },
    },

    methods: {
        buildProductMedia(mediaId) {
            this.isLoading = true;

            const productMedia = this.$super('buildProductMedia', mediaId);

            if (!productMedia.extensions.productMediaLanguage.id) {
                const productMediaLanguage = this.productMediaLanguageRepository.create(Shopware.context, productMedia.id);
                productMediaLanguage.productMediaId = productMedia.id;
                productMediaLanguage.languageId = Shopware.State.get('context').api.languageId;
                productMediaLanguage.cover = false;

                productMedia.extensions.productMediaLanguage = productMediaLanguage;
            }

            this.isLoading = false;

            return productMedia;
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

        // successfulUpload({ targetId }) {
        //     // on replace
        //     if (this.product.media.find((productMedia) => productMedia.mediaId === targetId)) {
        //         return;
        //     }
        //
        //     const productMedia = this.createMediaAssociation(targetId);
        //     this.product.media.add(productMedia);
        // },

        createMediaAssociation(targetId) {
            const productMedia = this.$super('createMediaAssociation', targetId);

            if (!productMedia.extensions.productMediaLanguage || !productMedia.extensions.productMediaLanguage.id) {
                const productMediaLanguage = this.productMediaLanguageRepository.create(Shopware.context, productMedia.id);
                productMediaLanguage.productMediaId = targetId;
                productMediaLanguage.languageId = Shopware.State.get('context').api.languageId;
                productMediaLanguage.cover = false;

                productMedia.extensions.productMediaLanguage = productMediaLanguage;
            }

            return productMedia;
        },

        // onUploadFailed(uploadTask) {
        //     const toRemove = this.product.media.find((productMedia) => {
        //         return productMedia.mediaId === uploadTask.targetId;
        //     });
        //     if (toRemove) {
        //         if (this.product.coverId === toRemove.id) {
        //             this.product.coverId = null;
        //         }
        //         this.product.media.remove(toRemove.id);
        //     }
        //     this.product.isLoading = false;
        // },

        removeCover() {
            this.$super('removeCover');

            this.product.media.forEach((productMediaElement) => {
                if (productMediaElement.extensions.productMediaLanguage) {
                    productMediaElement.extensions.productMediaLanguage.cover = false;
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
                    this.product.media.first().extensions.productMediaLanguage.cover = true;
                }
            }
        },

        markMediaAsCover(productMedia) {
            this.$super('markMediaAsCover', productMedia);

            this.product.media.forEach((productMediaElement) => {
                if (productMediaElement.extensions.productMediaLanguage) {
                    productMediaElement.extensions.productMediaLanguage.cover = false;
                }
            })

            if (productMedia.extensions.productMediaLanguage) {
                productMedia.extensions.productMediaLanguage.cover = true;
            }
        },

        onDropMedia(dragData) {
            this.$super('onDropMedia', dragData)

            const productMedia = this.product.media.find((productMedia) => productMedia.mediaId === dragData.id);
            if (productMedia.extensions.productMediaLanguage
                && productMedia.extensions.productMediaLanguage.cover !== true
                && this.product.media.length === 1) {
                productMedia.extensions.productMediaLanguage.cover = true;
            }
        },
    },
});
