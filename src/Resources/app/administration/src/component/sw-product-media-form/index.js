// TODO: cover handling in admin

const {Component} = Shopware;
const {Criteria} = Shopware.Data;
Component.override('sw-product-media-form', {
    computed: {
        product() {
            const state = Shopware.State.get('swProductDetail');

            if (this.isInherited) {
                return state.parentProduct;
            }

            console.log('state.product:', state.product);

            return state.product;
        },

        mediaItems() {
            const mediaItems = this.productMedia.slice();
            const placeholderCount = this.getPlaceholderCount(this.columnCount);

            if (placeholderCount === 0) {
                return mediaItems;
            }

            for (let i = 0; i < placeholderCount; i += 1) {
                mediaItems.push(this.createPlaceholderMedia(mediaItems));
            }
            return mediaItems;
        },

        cover() {
            if (!this.product) {
                return null;
            }
            const coverId = this.product.cover ? this.product.cover.mediaId : this.product.coverId;

            return this.product.media.find(media => {
                    if (media.extensions.productMediaLanguage) {
                        return media.extensions.productMediaLanguage.cover === 1;
                    } else {
                        return false;
                    }
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
                if (coverMedium.extensions.productMediaLanguage) {
                    return coverMedium.extensions.productMediaLanguage.cover === 1;
                } else {
                    return false;
                }
            });

            return coverMediaItem.id;
        },
    },

    methods: {
        buildProductMedia(mediaId) {
            this.isLoading = true;

            const productMedia = this.$super('buildProductMedia', mediaId);

            if (!productMedia.extensionss.productMediaLanguage.id) {
                const productMediaLanguage = this.productMediaLanguageRepository.create(Shopware.context, mediaId);
                productMediaLanguage.productMediaId = mediaId;
                productMediaLanguage.languageId = Shopware.State.get('context').api.languageId;
                productMedia.extensionss.productMediaLanguage = productMediaLanguage;
            }

            // productMedia.productMediaLanguage = {
            //     id: mediaId,
            //     productMediaId: mediaId,
            //     languageId: Shopware.State.get('context').api.languageId
            // };

            this.isLoading = false;

            return productMedia;
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

            if (!productMedia.extensionss.productMediaLanguage.id) {
                const productMediaLanguage = this.productMediaLanguageRepository.create(Shopware.context, mediaId);
                productMediaLanguage.productMediaId = mediaId;
                productMediaLanguage.languageId = Shopware.State.get('context').api.languageId;
                productMedia.extensions.productMediaLanguage = productMediaLanguage;
            }

            // productMedia.extensions.productMediaLanguage = {
            //     id: targetId,
            //     productMediaId: targetId,
            //     languageId: Shopware.State.get('context').api.languageId
            // };

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

        // removeCover() {
        //     this.product.cover = null;
        //     this.product.coverId = null;
        // },

        isCover(productMedia) {
            if (productMedia.extensions.productMediaLanguage) {
                return productMedia.extensions.productMediaLanguage.cover === 1;
            }

            return false;

            // const coverId = this.product.cover ? this.product.cover.id : this.product.coverId;
            //
            // if (this.product.media.length === 0 || productMedia.isPlaceholder) {
            //     return false;
            // }
            //
            // return productMedia.id === coverId;
        },

        removeFile(productMedia) {
            this.$super('productMedia', productMedia);

            if(productMedia.extensions.productMediaLanguage && productMedia.extensions.productMediaLanguage.cover === 1) {
                this.product.media.first().extensions.productMediaLanguage.cover = 1;
            }
        },

        markMediaAsCover(productMedia) {
            this.$super('productMedia', productMedia);

            if (productMedia.extensions.productMediaLanguage) {
                productMedia.extensions.productMediaLanguage.cover = 1;
            }
        },

        onDropMedia(dragData) {
            this.$super('onDropMedia', dragData)

            const productMedia = this.product.media.find((productMedia) => productMedia.mediaId === dragData.id);
            if (productMedia.extensions.productMediaLanguage) {
                productMedia.extensions.productMediaLanguage.cover = 1;
            }
        },
    },
});
